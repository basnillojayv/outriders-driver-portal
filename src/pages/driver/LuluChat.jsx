import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { T } from "@/components/driver/v3/v3tokens";
import BottomNav from "@/components/driver/v3/BottomNav";

const LULU_AVATAR =
  "https://media.base44.com/images/public/69c2ecd0ede0075a7b2fe2d0/c883a6827_ask_lulu.svg";

export default function LuluChat() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Start (or resume) a Lulu conversation on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await base44.agents.listConversations({ agent_name: "lulu" });
        let convo = existing && existing.length > 0 ? existing[0] : null;
        if (!convo) {
          convo = await base44.agents.createConversation({
            agent_name: "lulu",
            metadata: { name: "Ask Lulu", description: "Lulu concierge chat" },
          });
        }
        if (cancelled) return;
        setConversation(convo);
        setMessages(convo.messages || []);
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Subscribe to streaming updates for this conversation
  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsubscribe();
  }, [conversation?.id]);

  // Seed a friendly opener if the conversation is empty
  useEffect(() => {
    if (!conversation || messages.length > 0) return;
    const name = user?.full_name?.split(" ")[0] || "there";
    setMessages([{
      role: "assistant",
      content: `Hey ${name}! I'm Lulu — your LineHaul Station concierge. I can help with your membership, OneHome, referrals, events, or anything else. What can I do for you?`,
    }]);
  }, [conversation, user, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !conversation) return;
    setInput("");
    setLoading(true);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content: text });
    } catch {
      setLoading(false);
    }
  };

  const busy = loading || (conversation && messages.some((m) => m.role === "user" && !messages.find((m2, i2) => i2 > messages.indexOf(m) && m2.role === "assistant")));

  return (
    <div className="flex flex-col h-screen" style={{ background: T.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: T.border, background: T.card }}>
        <img src={LULU_AVATAR} alt="Lulu" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: T.textPrimary, fontSize: 15 }}>
            Lulu
          </p>
          <p style={{ fontSize: 12, color: T.textMuted }}>Your LineHaul Station concierge</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
              msg.role === "user"
                ? "text-white"
                : ""
            }`} style={msg.role === "user"
              ? { background: T.orange, color: "#0A0A0A" }
              : { background: T.card, border: `1px solid ${T.border}` }}>
              {msg.role === "user" ? (
                <p className="text-sm">{msg.content}</p>
              ) : (
                <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" style={{ color: T.textSecondary }}>
                  {msg.content}
                </ReactMarkdown>
              )}
              {msg.tool_calls?.map((tc, idx) => (
                <div key={idx} className="mt-2 text-xs flex items-center gap-1.5" style={{ color: T.textMuted }}>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>{tc.name || "working"}…</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3" style={{ background: T.card, border: `1px solid ${T.border}` }}>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: T.textMuted }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: T.border, background: T.card }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lulu anything..."
            className="flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: T.orange,
              color: "#0A0A0A",
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading || !input.trim() ? 0.4 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}