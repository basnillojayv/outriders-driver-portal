import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  ShieldCheck, Camera, Mail, Phone as PhoneIcon, BadgeCheck,
  Save, Loader2, Share2, Users, GraduationCap,
  Briefcase, Truck, Eye,
} from "lucide-react";
import { toast } from "sonner";
import V3Shell from "@/components/driver/v3/V3Shell";
import BackBar from "@/components/driver/BackBar";
import V3LoadingScreen from "@/components/driver/v3/V3LoadingScreen";
import { T, btnPrimary, btnSecondary } from "@/components/driver/v3/v3tokens";
import PassportCover from "@/components/driver/passport/PassportCover";
import PassportSection from "@/components/driver/passport/PassportSection";
import DocumentVaultSection from "@/components/driver/passport/DocumentVaultSection";
import ExperienceSection from "@/components/driver/passport/ExperienceSection";
import ReferencesSection from "@/components/driver/passport/ReferencesSection";
import PassportPreview from "@/components/driver/passport/PassportPreview";

const TRACTOR_TYPES = ["Day Cab", "Sleeper", "Conventional", "Cabover"];
const TRAILER_TYPES = ["Dry Van", "Reefer", "Flatbed", "Tanker", "Car Hauler", "Container"];
const FREIGHT_TYPES = ["General Freight", "Hazmat", "Oversize", "Refrigerated", "Liquid", "Bulk"];

function FieldLabel({ children }) {
  return (
    <label style={{
      fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
      color: T.textMuted, letterSpacing: "0.18em", textTransform: "uppercase",
      display: "block", marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", background: T.cardAlt, color: T.textPrimary,
  border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
  padding: "12px 14px", fontSize: 14, fontFamily: "var(--font-body)",
};

function ChipSelector({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              padding: "8px 14px", borderRadius: 999,
              fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
              background: active ? T.orange : T.cardAlt,
              color: active ? "#0A0A0A" : T.textSecondary,
              border: `1px solid ${active ? T.orange : T.border}`,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PassportEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: memberData } = useQuery({
    queryKey: ["member", user?.id],
    queryFn: () => base44.entities.Member.filter({ portal_user_id: user.id }),
    enabled: !!user,
  });
  const memberId = memberData?.[0]?.lhs_member_id || "Not assigned";

  const [form, setForm] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tractorTypes, setTractorTypes] = useState([]);
  const [trailerTypes, setTrailerTypes] = useState([]);
  const [freightTypes, setFreightTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [references, setReferences] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  React.useEffect(() => {
    if (user && !form) {
      const nameParts = (user.full_name || "").split(" ").filter(Boolean);
      setForm({
        first_name: user.first_name || nameParts[0] || "",
        last_name: user.last_name || nameParts.slice(1).join(" ") || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        headline: user.headline || "",
        username: user.username || "",
        summary: user.summary || "",
        cdl_number: user.cdl_number || "",
        cdl_state: user.cdl_state || "",
        endorsements: user.endorsements || "",
        medical_card_expiry: user.medical_card_expiry || "",
      });
      setPhotoUrl(user.profile_photo_url || null);
      try { setTractorTypes(user.tractor_types ? JSON.parse(user.tractor_types) : []); } catch { setTractorTypes([]); }
      try { setTrailerTypes(user.trailer_types ? JSON.parse(user.trailer_types) : []); } catch { setTrailerTypes([]); }
      try { setFreightTypes(user.freight_types ? JSON.parse(user.freight_types) : []); } catch { setFreightTypes([]); }
      try { setDocuments(user.passport_documents ? JSON.parse(user.passport_documents) : []); } catch { setDocuments([]); }
      try { setExperiences(user.experience ? JSON.parse(user.experience) : []); } catch { setExperiences([]); }
      try { setReferences(user.references ? JSON.parse(user.references) : []); } catch { setReferences([]); }
    }
  }, [user, form]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggle = (setter) => (opt) => setter(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  const addDocument = (doc) => setDocuments(prev => [...prev, doc]);
  const removeDocument = (idx) => setDocuments(prev => prev.filter((_, i) => i !== idx));

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(file_url);
    } catch {
      toast.error("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({
        ...form,
        profile_photo_url: photoUrl,
        tractor_types: JSON.stringify(tractorTypes),
        trailer_types: JSON.stringify(trailerTypes),
        freight_types: JSON.stringify(freightTypes),
        passport_documents: JSON.stringify(documents),
        experience: JSON.stringify(experiences),
        references: JSON.stringify(references),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Passport saved.");
      navigate("/digital-passport");
    },
    onError: () => toast.error("Could not save passport."),
  });

  if (isLoading || !form) return <V3LoadingScreen />;

  const initials = [form.first_name, form.last_name].filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase() || "D";
  const memberName = [form.first_name, form.last_name].filter(Boolean).join(" ") || "—";

  const fieldChecks = [
    form.first_name, form.last_name, form.phone, form.city, form.state,
    form.headline, form.summary, form.cdl_number, form.cdl_state,
    form.endorsements, form.medical_card_expiry,
    photoUrl,
    tractorTypes.length > 0, trailerTypes.length > 0, freightTypes.length > 0,
  ];
  const filled = fieldChecks.filter(f => typeof f === "boolean" ? f : (f && String(f).trim().length > 0)).length;
  const completion = Math.round((filled / fieldChecks.length) * 100);

  const onShare = async () => {
    const shareUrl = `${window.location.origin}/career-center`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Digital Passport", url: shareUrl }); } catch {}
    } else {
      navigator.clipboard?.writeText(shareUrl);
      toast.success("Share link copied.");
    }
  };

  return (
    <>
    <V3Shell>
      <BackBar />
      <div className="space-y-4 max-w-md mx-auto">
        <PassportCover memberName={memberName} memberId={memberId} completion={completion} />

        {/* ── Photo upload ── */}
        <PassportSection icon={Camera} title="Profile Photo" page={1}>
          <div className="flex items-center gap-4">
            <div style={{
              width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
              background: T.cardAlt, border: `1px solid ${T.border}`, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {photoUrl
                ? <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 800, color: T.textMuted }}>{initials}</span>}
            </div>
            <div className="flex-1">
              <label style={{ ...btnSecondary, fontSize: 12, padding: "10px 16px", minHeight: 40, cursor: "pointer", position: "relative" }}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                {uploading ? "Uploading…" : "Upload Photo"}
                <input type="file" accept="image/*" onChange={onPhoto} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              </label>
            </div>
          </div>
        </PassportSection>

        {/* ── Identity ── */}
        <PassportSection icon={Users} title="Identity" page={2}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>First Name</FieldLabel>
              <input style={inputStyle} value={form.first_name} onChange={set("first_name")} placeholder="First name" />
            </div>
            <div>
              <FieldLabel>Last Name</FieldLabel>
              <input style={inputStyle} value={form.last_name} onChange={set("last_name")} placeholder="Last name" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Phone</FieldLabel>
              <input style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="Phone number" />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <input style={inputStyle} value={form.city} onChange={set("city")} placeholder="City" />
            </div>
            <div>
              <FieldLabel>State</FieldLabel>
              <input style={inputStyle} value={form.state} onChange={set("state")} placeholder="State" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Headline</FieldLabel>
              <input style={inputStyle} value={form.headline} onChange={set("headline")} placeholder="Professional headline" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Handle</FieldLabel>
              <input style={inputStyle} value={form.username} onChange={set("username")} placeholder="Public username" />
            </div>
          </div>
        </PassportSection>

        {/* ── CDL & Credentials ── */}
        <PassportSection icon={ShieldCheck} title="CDL & Credentials" page={3}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>CDL Number</FieldLabel>
              <input style={inputStyle} value={form.cdl_number} onChange={set("cdl_number")} placeholder="CDL number" />
            </div>
            <div>
              <FieldLabel>CDL State</FieldLabel>
              <input style={inputStyle} value={form.cdl_state} onChange={set("cdl_state")} placeholder="Issuing state" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Endorsements</FieldLabel>
              <input style={inputStyle} value={form.endorsements} onChange={set("endorsements")} placeholder="e.g. Hazmat, Tanker, Doubles/Triples" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Medical Card Expiry</FieldLabel>
              <input type="date" style={inputStyle} value={form.medical_card_expiry} onChange={set("medical_card_expiry")} />
            </div>
          </div>
        </PassportSection>

        {/* ── Equipment ── */}
        <PassportSection icon={Truck} title="Equipment" page={4}>
          <div className="space-y-4">
            <div>
              <FieldLabel>Tractor Types</FieldLabel>
              <ChipSelector options={TRACTOR_TYPES} selected={tractorTypes} onToggle={toggle(setTractorTypes)} />
            </div>
            <div>
              <FieldLabel>Trailer Types</FieldLabel>
              <ChipSelector options={TRAILER_TYPES} selected={trailerTypes} onToggle={toggle(setTrailerTypes)} />
            </div>
            <div>
              <FieldLabel>Freight Types</FieldLabel>
              <ChipSelector options={FREIGHT_TYPES} selected={freightTypes} onToggle={toggle(setFreightTypes)} />
            </div>
          </div>
        </PassportSection>

        {/* ── Career Summary (Experience) ── */}
        <ExperienceSection experiences={experiences} setExperiences={setExperiences} page={5} />

        {/* ── References ── */}
        <ReferencesSection references={references} setReferences={setReferences} page={6} />

        {/* ── Document Vault ── */}
        <DocumentVaultSection documents={documents} onAdd={addDocument} onRemove={removeDocument} page={7} />

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setPreviewOpen(true)}
            style={{ ...btnSecondary, flex: 1 }}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            style={{ ...btnPrimary, flex: 1 }}
          >
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Passport
          </button>
        </div>

        <button onClick={onShare} style={{ ...btnSecondary, width: "100%" }}>
          <Share2 size={16} />
          Share Passport
        </button>
      </div>
    </V3Shell>

    <PassportPreview
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      data={{
        form,
        photoUrl,
        memberId,
        completion,
        memberName,
        tractorTypes,
        trailerTypes,
        freightTypes,
        documents,
        experiences,
        references,
      }}
    />
    </>
  );
}