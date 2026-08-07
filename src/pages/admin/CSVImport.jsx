import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Users } from "lucide-react";

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^,]+)/g)?.map((v) => v.trim().replace(/^"|"$/g, "")) || [];
    if (values.length > 0) {
      const row = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
      rows.push(row);
    }
  }
  return { headers, rows };
}

function mapRow(row) {
  const findCol = (names) => {
    for (const name of names) {
      const key = Object.keys(row).find((k) => k.toLowerCase().replace(/[^a-z]/g, "") === name.toLowerCase().replace(/[^a-z]/g, ""));
      if (key && row[key]) return row[key];
    }
    return "";
  };
  return {
    first_name: findCol(["firstname", "first name", "first"]),
    last_name: findCol(["lastname", "last name", "last"]),
    email: findCol(["email", "emailaddress", "email address"]),
    phone: findCol(["phone", "phonenumber", "phone number", "mobile"]),
    business_name: findCol(["businessname", "business name", "carrier", "company"]),
    tags: findCol(["tags", "tag", "type"]),
    csv_import_date: new Date().toISOString(),
    status: "imported",
    last_activity: new Date().toISOString(),
  };
}

export default function CSVImport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { headers, rows } = parseCSV(ev.target.result);
      const mapped = rows.map(mapRow).filter((r) => r.email && r.first_name);
      setPreview({ headers, rawCount: rows.length, mapped });
    };
    reader.readAsText(f);
  }, []);

  const importMutation = useMutation({
    mutationFn: async (drivers) => {
      // Deduplicate by email against existing records
      const existing = await base44.entities.Driver.list("-created_date", 10000);
      const existingEmails = new Set(existing.map((d) => d.email.toLowerCase()));
      const newDrivers = [];
      const dupes = [];
      const invalid = [];

      drivers.forEach((d) => {
        if (!d.email) { invalid.push(d); return; }
        if (existingEmails.has(d.email.toLowerCase())) { dupes.push(d); return; }
        existingEmails.add(d.email.toLowerCase());
        newDrivers.push(d);
      });

      if (newDrivers.length > 0) {
        // Bulk create in batches of 50
        for (let i = 0; i < newDrivers.length; i += 50) {
          await base44.entities.Driver.bulkCreate(newDrivers.slice(i, i + 50));
        }
      }

      return { imported: newDrivers.length, duplicates: dupes.length, invalid: invalid.length };
    },
    onSuccess: (data) => {
      setResults(data);
      setPreview(null);
      setFile(null);
    },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">CSV Import</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload driver contacts from Automator</p>
      </div>

      {/* Upload area */}
      <Card>
        <CardContent className="p-8">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="font-heading font-semibold text-sm">
              {file ? file.name : "Drop CSV file or click to upload"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Required: First Name, Last Name, Email
            </span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Preview — {preview.mapped.length} valid drivers from {preview.rawCount} rows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Email</th>
                    <th className="text-left p-2 font-medium">Phone</th>
                    <th className="text-left p-2 font-medium">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.mapped.slice(0, 50).map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{d.first_name} {d.last_name}</td>
                      <td className="p-2 text-muted-foreground">{d.email}</td>
                      <td className="p-2 text-muted-foreground">{d.phone || "—"}</td>
                      <td className="p-2 text-muted-foreground">{d.business_name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.mapped.length > 50 && (
              <p className="text-xs text-muted-foreground mt-2">Showing first 50 of {preview.mapped.length}</p>
            )}
            <Button
              className="mt-4 w-full"
              onClick={() => importMutation.mutate(preview.mapped)}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? "Importing..." : `Import ${preview.mapped.length} Drivers`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card className="border-lhs-green/30">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-lhs-green">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-heading font-semibold">Import Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-lhs-green/10">
                <div className="text-2xl font-bold text-lhs-green">{results.imported}</div>
                <div className="text-xs text-muted-foreground">New Imports</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-muted-foreground">{results.duplicates}</div>
                <div className="text-xs text-muted-foreground">Duplicates</div>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10">
                <div className="text-2xl font-bold text-destructive">{results.invalid}</div>
                <div className="text-xs text-muted-foreground">Invalid</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}