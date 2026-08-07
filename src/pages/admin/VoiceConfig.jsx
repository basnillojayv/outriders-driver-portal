import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, AlertCircle, Mic, BookOpen, Tag, ShieldAlert, Ban } from "lucide-react";

const VOICE_URL = "https://raw.githubusercontent.com/LineHaulStation/app/main/JSONS/VOICE/VOICE-DRIVER.json";

function SectionCard({ icon: Icon, title, children, accent }) {
  const border = accent === "green" ? "border-l-4 border-l-lhs-green"
    : accent === "red" ? "border-l-4 border-l-lhs-red"
    : accent === "orange" ? "border-l-4 border-l-fuel-orange"
    : accent === "blue" ? "border-l-4 border-l-steel-blue"
    : "";

  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm ${border}`}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <Icon className="w-4 h-4 text-fuel-orange flex-shrink-0" />
        <h3 className="font-heading font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function VoiceConfig() {
  const [syncKey, setSyncKey] = useState(0);
  const [syncTime, setSyncTime] = useState(null);

  const { data: voice, isLoading, isError, isFetching } = useQuery({
    queryKey: ["voice-config", syncKey],
    queryFn: async () => {
      const res = await fetch(VOICE_URL);
      if (!res.ok) throw new Error("Failed to fetch voice config");
      const json = await res.json();
      setSyncTime(new Date());
      return json;
    },
    staleTime: Infinity,
  });

  const handleSync = () => setSyncKey((k) => k + 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-fuel-orange animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-lhs-red mx-auto" />
        <p className="text-sm text-muted-foreground">Failed to load voice config from GitHub.</p>
        <Button variant="outline" size="sm" onClick={handleSync}>Retry</Button>
      </div>
    );
  }

  const meta = voice?.repository_metadata || {};
  const identity = voice?.voice_identity || {};
  const tone = voice?.tone_rules || {};
  const botRules = voice?.bot_behavior_rules || [];
  const phrasesToAvoid = voice?.phrases_to_avoid || [];
  const contentFiltering = voice?.content_filtering_rules || {};

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs text-fuel-orange font-heading font-semibold uppercase tracking-widest mb-1">Admin Reference</p>
          <h1 className="font-heading text-2xl font-bold text-foreground">Driver Voice Config</h1>
          <p className="text-sm text-muted-foreground mt-1">{meta.repository_name}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isFetching}
          className="flex-shrink-0"
        >
          {isFetching
            ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Syncing…</>
            : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Sync Now</>
          }
        </Button>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-mono text-xs">v{meta.version}</Badge>
        {syncTime && (
          <Badge variant="secondary" className="text-xs">
            Synced {format(syncTime, "MMM d, h:mm a")}
          </Badge>
        )}
        {meta.audience && (
          <Badge variant="outline" className="text-xs">{meta.audience}</Badge>
        )}
      </div>

      {/* Voice Identity */}
      <SectionCard icon={Mic} title="Voice Identity" accent="orange">
        {identity.voice_summary && (
          <p className="text-sm text-foreground leading-relaxed">{identity.voice_summary}</p>
        )}
        {(identity.personality_traits || []).length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Personality Traits</p>
            <div className="flex flex-wrap gap-2">
              {identity.personality_traits.map((t, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
          </div>
        )}
        {identity.emotional_posture && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">Emotional Posture</p>
            <p className="text-sm text-foreground italic">{identity.emotional_posture}</p>
          </div>
        )}
        {identity.cadence && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">Cadence</p>
            <p className="text-sm text-foreground">{identity.cadence}</p>
          </div>
        )}
      </SectionCard>

      {/* Tone Rules */}
      <SectionCard icon={BookOpen} title="Tone Rules">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-lhs-green uppercase tracking-wider font-semibold mb-2">✓ Should Sound Like</p>
            <ul className="space-y-1.5">
              {(tone.should_sound_like || []).map((t, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-lhs-green mt-0.5 flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-lhs-red uppercase tracking-wider font-semibold mb-2">✗ Never Sound Like</p>
            <ul className="space-y-1.5">
              {(tone.should_never_sound_like || []).map((t, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-lhs-red mt-0.5 flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {tone.aspiration_vs_practicality && (
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">Content Mix</p>
            <p className="text-sm text-foreground">{tone.aspiration_vs_practicality}</p>
          </div>
        )}
      </SectionCard>

      {/* Vocabulary */}
      {(identity.vocabulary_tendencies || []).length > 0 && (
        <SectionCard icon={Tag} title="Approved Vocabulary">
          <div className="flex flex-wrap gap-2">
            {identity.vocabulary_tendencies.map((v, i) => (
              <Badge key={i} variant="outline" className="text-xs text-foreground">{v}</Badge>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Bot Behavior Rules */}
      {botRules.length > 0 && (
        <SectionCard icon={ShieldAlert} title="Bot Behavior Rules — Always Apply" accent="orange">
          <ul className="space-y-2.5">
            {botRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-fuel-orange font-bold text-xs mt-0.5 flex-shrink-0 font-mono w-5 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Phrases to Avoid */}
      {phrasesToAvoid.length > 0 && (
        <SectionCard icon={Ban} title="Phrases to Avoid — Do Not Use" accent="red">
          <div className="space-y-2">
            {phrasesToAvoid.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-lhs-red/5 border border-lhs-red/15 rounded-lg px-3 py-2.5">
                <span className="text-sm text-lhs-red font-semibold flex-shrink-0">"{item.phrase}"</span>
                <span className="text-sm text-muted-foreground">{item.reason}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Content Filtering */}
      {Object.keys(contentFiltering).length > 0 && (
        <SectionCard icon={ShieldAlert} title="Content Filtering Rules" accent="blue">
          <div className="space-y-3">
            {Object.entries(contentFiltering).map(([key, val], i) => (
              <div key={i} className="rounded-lg bg-secondary border border-border p-3">
                <p className="text-xs text-steel-blue font-heading font-semibold uppercase tracking-wide mb-1">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-foreground">
                  {Array.isArray(val) ? val.join(" • ") : String(val)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}