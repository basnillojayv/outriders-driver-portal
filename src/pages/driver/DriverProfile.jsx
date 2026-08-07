import React, { useState, useEffect, useRef } from "react";
import { getBadgeForCounts } from "@/lib/badges";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Circle, Camera, Save, Loader2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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

function Field({ label, helper, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
      {helper && <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>}
    </div>
  );
}

export default function DriverProfile() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [cdlNumber, setCdlNumber] = useState("");
  const [cdlState, setCdlState] = useState("");
  const [cocViewed, setCocViewed] = useState(false);
  const [cocAccepted, setCocAccepted] = useState(false);
  const [cocDate, setCocDate] = useState(null);
  const [showCoc, setShowCoc] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setCity(user.city || "");
      setState(user.state || "");
      setBio(user.bio || "");
      setCdlNumber(user.cdl_number || "");
      setCdlState(user.cdl_state || "");
      setCocAccepted(!!user.code_of_conduct_accepted);
      setCocDate(user.code_of_conduct_date || null);
      if (user.code_of_conduct_accepted) setCocViewed(true);
      setPhotoUrl(user.profile_photo_url || "");
      setPhotoPreview(user.profile_photo_url || null);
    }
  }, [user]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCocView = () => {
    setCocViewed(true);
    setShowCoc(true);
  };

  const handleCocAccept = () => {
    setCocAccepted(true);
    setCocDate(new Date().toISOString());
    setShowCoc(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let finalPhotoUrl = photoUrl;
      if (photoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
        finalPhotoUrl = file_url;
      }
      await base44.auth.updateMe({
        username,
        first_name: firstName,
        last_name: lastName,
        city,
        state,
        bio,
        cdl_number: cdlNumber,
        cdl_state: cdlState,
        code_of_conduct_accepted: cocAccepted,
        code_of_conduct_date: cocDate,
        profile_photo_url: finalPhotoUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setPhotoFile(null);
      toast.success("Profile saved");
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  const checklist = [
    { label: "Choose a username", done: !!username?.trim() },
    { label: "Upload your profile picture", done: !!(photoPreview) },
    { label: "Enter your CDL information", done: !!(cdlNumber?.trim() && cdlState) },
    { label: "Accept the Code of Conduct", done: cocAccepted },
  ];
  const allDone = checklist.every((c) => c.done);

  return (
    <div className="px-4 pt-6 pb-10 space-y-5 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your LineHaul Station profile to activate your account. You can complete the required steps in any order.
        </p>
      </div>

      {/* Activation Checklist */}
      <Card className={allDone ? "border-lhs-green bg-lhs-green/5" : ""}>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">
            {allDone ? "✅ Your profile is activated!" : "Activation Checklist"}
          </h3>
          {!allDone && (
            <p className="text-xs text-muted-foreground">Complete these in any order.</p>
          )}
          <div className="space-y-2">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                {item.done
                  ? <CheckCircle2 className="w-4 h-4 text-lhs-green flex-shrink-0" />
                  : <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
                <span className={`text-sm ${item.done ? "text-foreground line-through opacity-60" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Photo */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">Profile Picture</h3>
          <p className="text-xs text-muted-foreground">Upload a clear photo of your face. No sunglasses, no hat. Used for identification at LineHaul Station.</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-border">
              {photoPreview
                ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                : <Camera className="w-7 h-7 text-muted-foreground" />
              }
            </div>
            <label className="cursor-pointer">
              <input type="file" accept="image/jpeg,image/png,image/gif" capture="user" className="hidden" onChange={handlePhoto} />
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                <Camera className="w-3.5 h-3.5" />
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Account & Identity */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-heading text-sm font-semibold">Account & Identity</h3>

          <Field
            label="Username"
            helper="Your public name for promotions, rankings, and shareable member content. Choose something respectful and appropriate for a professional community."
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="YourHandle"
                className="w-full border border-input rounded-lg pl-7 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>
            <Field label="Last Name">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>
            <Field label="State">
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* CDL Information */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-heading text-sm font-semibold">CDL Information</h3>
          <p className="text-xs text-muted-foreground">This confirms you are an active driver. Your CDL number is kept private.</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CDL Number">
              <input
                value={cdlNumber}
                onChange={(e) => setCdlNumber(e.target.value)}
                placeholder="CDL Number"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>
            <Field label="Issuing State">
              <Select value={cdlState} onValueChange={setCdlState}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Code of Conduct */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">Code of Conduct</h3>
          {cocAccepted && cocDate ? (
            <div className="flex items-center gap-2 text-sm text-lhs-green">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Accepted on {format(new Date(cocDate), "MMMM d, yyyy")}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleCocView}
                className="text-sm text-primary underline underline-offset-2 font-medium"
              >
                View Code of Conduct
              </button>
              <label className={`flex items-start gap-2.5 cursor-pointer ${!cocViewed ? "opacity-40 pointer-events-none" : ""}`}>
                <input
                  type="checkbox"
                  checked={cocAccepted}
                  onChange={(e) => {
                    if (e.target.checked) handleCocAccept();
                    else { setCocAccepted(false); setCocDate(null); }
                  }}
                  disabled={!cocViewed}
                  className="mt-0.5 accent-fuel-orange w-4 h-4"
                />
                <span className="text-sm leading-snug">I have read and accept the LineHaul Station Code of Conduct</span>
              </label>
              {!cocViewed && <p className="text-xs text-muted-foreground">You must view the Code of Conduct before accepting.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Membership Status */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">Membership Status</h3>
          <div className="flex items-center gap-3">
            {(() => {
              const badge = getBadgeForCounts(user?.referral_count || 0, user?.network_count || 0);
              return (
                <>
                  <img src={badge.img} alt={badge.name} className="w-12 h-12 object-contain flex-shrink-0" />
                  <div className="space-y-1 text-sm flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Badge</span>
                      <span className="font-heading font-bold text-fuel-orange">{badge.name.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Standing</span>
                      <span className="flex items-center gap-1.5 text-lhs-green font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing
                      </span>
                    </div>
                    {user?.created_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">{format(new Date(user.created_date), "MMMM yyyy")}</span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold">Bio <span className="text-muted-foreground font-normal">(Optional)</span></h3>
          <p className="text-xs text-muted-foreground">A short line about yourself. This appears on your profile.</p>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 120))}
            placeholder="e.g. 15 years OTR, Midwest specialist"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground text-right">{bio.length}/120 characters</p>
        </CardContent>
      </Card>

      {/* Save */}
      <Button
        className="w-full h-12 font-heading font-semibold"
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
      >
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Profile
      </Button>

      {/* CoC Modal */}
      {showCoc && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold">Code of Conduct</h2>
              <button onClick={() => setShowCoc(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">{COC_TEXT}</pre>
            </div>
            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleCocAccept}>
                I Accept the Code of Conduct
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}