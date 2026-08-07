import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload, Loader2, AlertCircle, ShieldCheck, Camera } from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const COC_TEXT = `LINEHAUL STATION — CODE OF CONDUCT

As a member of the LineHaul Station Outriders Club, I agree to:

1. RESPECT: Treat all fellow members, staff, and partners with respect and professionalism at all times, both online and in person.

2. HONESTY: Provide accurate information about myself, my qualifications, and my experience. I will not misrepresent my credentials or identity.

3. PROFESSIONALISM: Uphold the highest standards of professional conduct in all interactions representing the LineHaul Station brand.

4. COMMUNITY: Contribute positively to the Outriders community. Support fellow drivers. Share knowledge and experience generously.

5. SAFETY: Prioritize safety above all else on the road. Never operate a vehicle while impaired or in violation of federal or state regulations.

6. INTEGRITY: Act with integrity in all business dealings. Do not engage in fraud, theft, or any illegal activity.

7. CONFIDENTIALITY: Respect the privacy of other members. Do not share personal information without consent.

8. COMPLIANCE: Comply with all applicable laws, regulations, and LineHaul Station platform policies.

Violation of this Code of Conduct may result in suspension or permanent removal from the LineHaul Station platform.`;

export default function Activation() {
  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get("id");

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cdlNumber, setCdlNumber] = useState("");
  const [cdlState, setCdlState] = useState("");
  const [cocAccepted, setCocAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!driverId) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    base44.entities.Driver.get(driverId)
      .then((result) => {
        if (result) {
          setDriver(result);
        } else {
          setInvalid(true);
        }
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [driverId]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    let photoUrl = "";
    if (photo) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: photo });
      photoUrl = file_url;
    }

    await base44.entities.Driver.update(driver.id, {
      username,
      profile_photo_url: photoUrl,
      cdl_number: cdlNumber,
      cdl_state: cdlState,
      code_of_conduct_accepted: true,
      status: "activation_pending",
      last_activity: new Date().toISOString(),
    });

    await base44.entities.AvatarTask.create({
      driver_id: driver.id,
      driver_name: `${driver.first_name} ${driver.last_name}`,
      username,
      photo_url: photoUrl,
      status: "pending",
    });

    await base44.entities.CommunicationLog.create({
      driver_id: driver.id,
      type: "status_change",
      subject: "Activation form submitted",
      body: "Driver completed activation form via public link",
    });

    window.location.href = `/welcome?id=${driver.id}`;
  };

  const canSubmit = username.trim().length >= 3 && photo && cdlNumber.trim() && cdlState && cocAccepted;

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A2A] animate-spin" />
      </div>
    );
  }

  // --- Invalid link ---
  if (invalid) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto" />
          <h1 className="font-heading text-2xl font-bold text-white">This link doesn't look right.</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Contact LineHaul Station Member Support at{" "}
            <a href="mailto:lulu@linehaul-station.com" className="text-[#C85A2A] underline">
              lulu@linehaul-station.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // --- Form ---
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-lg mx-auto px-5 py-12 space-y-8">

        {/* Brand + Welcome */}
        <div className="space-y-2">
          <p className="text-[#C85A2A] text-xs font-heading font-bold uppercase tracking-[0.2em]">
            LineHaul Station
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight">
            Hey {driver.first_name},<br />let's get you activated.
          </h1>
          <p className="text-white/50 text-sm">
            Fill this out once. It takes 2 minutes.
          </p>
        </div>

        {/* Step 1 — Username */}
        <div className="space-y-3">
          <Label step="1" title="Choose Your Handle" />
          <p className="text-xs text-white/40">Your public name on rankings, leaderboards, and promo materials.</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm select-none">@</span>
            <input
              type="text"
              placeholder="TomH_LHS"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#444] rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-[#888] text-sm focus:outline-none focus:border-[#C85A2A] focus:bg-[#222] focus:ring-1 focus:ring-[#C85A2A] transition-colors"
            />
          </div>
          {username && username.trim().length < 3 && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> At least 3 characters required
            </p>
          )}
        </div>

        {/* Step 2 — Profile Photo */}
        <div className="space-y-3">
          <Label step="2" title="Profile Photo" />
          <p className="text-xs text-white/40">Used to create your Outriders avatar. Face clearly visible, good lighting.</p>
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              capture="user"
              className="hidden"
              onChange={handlePhoto}
            />
            {photoPreview ? (
              <div className="relative w-full flex items-center gap-4 bg-white/5 border border-white/15 rounded-xl p-4">
                <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#C85A2A]" />
                <div>
                  <p className="text-sm text-white font-medium">Photo uploaded</p>
                  <p className="text-xs text-white/40 mt-0.5">Tap to change</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/15 rounded-xl py-10 hover:border-[#C85A2A]/50 transition-colors">
                <Camera className="w-9 h-9 text-white/25" />
                <span className="text-sm text-white/50">Tap to upload photo</span>
                <span className="text-xs text-white/25">JPG, PNG, or GIF</span>
              </div>
            )}
          </label>
        </div>

        {/* Step 3 — CDL */}
        <div className="space-y-3">
          <Label step="3" title="CDL Information" />
          <p className="text-xs text-white/40">Verifies you're a licensed driver. Kept private and never shared.</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="CDL Number"
              value={cdlNumber}
              onChange={(e) => setCdlNumber(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-[#444] rounded-xl px-4 py-3 text-white placeholder:text-[#888] text-sm focus:outline-none focus:border-[#C85A2A] focus:bg-[#222] focus:ring-1 focus:ring-[#C85A2A] transition-colors"
            />
            <Select value={cdlState} onValueChange={setCdlState}>
              <SelectTrigger className="w-24 bg-[#1a1a1a] border-[#444] text-white rounded-xl focus:ring-[#C85A2A] focus:border-[#C85A2A]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Step 4 — Code of Conduct */}
        <div className="space-y-3">
          <Label step="4" title="Code of Conduct" />
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-52 overflow-y-auto">
            <pre className="text-xs text-white/55 whitespace-pre-wrap font-body leading-relaxed">{COC_TEXT}</pre>
          </div>
          <label className="flex items-start gap-3 cursor-pointer" onClick={() => setCocAccepted(!cocAccepted)}>
            <Checkbox
              checked={cocAccepted}
              onCheckedChange={setCocAccepted}
              className="mt-0.5 border-white/30 data-[state=checked]:bg-[#C85A2A] data-[state=checked]:border-[#C85A2A]"
            />
            <span className="text-sm text-white/80 leading-snug">
              I've read and agree to the LineHaul Station Code of Conduct
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2 pb-8">
          <button
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="w-full h-14 rounded-xl bg-[#C85A2A] hover:bg-[#b04e24] disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold text-base flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Activating…</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Activate My Membership</>
            )}
          </button>
          <p className="text-center text-xs text-white/25 mt-4">
            Questions? Email{" "}
            <a href="mailto:lulu@linehaul-station.com" className="text-[#C85A2A]">lulu@linehaul-station.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Label({ step, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-6 h-6 rounded-full bg-[#C85A2A] text-white text-xs font-bold flex items-center justify-center font-heading flex-shrink-0">
        {step}
      </span>
      <h2 className="font-heading font-semibold text-white text-base">{title}</h2>
    </div>
  );
}