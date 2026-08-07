import React, { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { T, btnPrimary, btnSecondary } from "@/components/driver/v3/v3tokens";

const ONEHOME_URL = "https://www.linehaulstation.com/one-home";
const SHARE_TEXT = `Join me at LineHaul Station — OneHome. Resort-quality living for truckers, only $59/night with no membership required. ${ONEHOME_URL}`;

export default function ShareDriverFriends() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "OneHome — LineHaul Station",
          text: SHARE_TEXT,
          url: ONEHOME_URL,
        });
        return;
      } catch { /* cancelled */ }
    }
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 20,
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
        <Share2 size={16} style={{ color: T.orange }} />
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
          color: T.textPrimary, letterSpacing: "0.04em",
        }}>
          Share with Driver Friends
        </p>
      </div>
      <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
        Know a driver who'd love OneHome?
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 w-full"
          style={{ ...btnPrimary, width: "100%" }}
        >
          <Share2 size={16} />
          Share Link
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 w-full"
          style={{ ...btnSecondary, width: "100%" }}
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}