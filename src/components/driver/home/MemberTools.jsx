import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Home, Truck, CalendarDays, MessageCircle, Users } from "lucide-react";

const TOOLS = [
  { label: "Career Center", icon: Briefcase,     path: "/career",          color: "var(--fuel-300)",     bg: "rgba(232,161,75,0.08)",  border: "rgba(232,161,75,0.18)" },
  { label: "OneHome Space", icon: Home,          path: "/space",           color: "#ee752c",             bg: "rgba(238,117,44,0.08)",  border: "rgba(238,117,44,0.18)" },
  { label: "Fleet Services",icon: Truck,         path: "/fleet-services",  color: "#5b9bd5",             bg: "rgba(91,155,213,0.08)",  border: "rgba(91,155,213,0.18)" },
  { label: "Events",        icon: CalendarDays,  path: "/events",          color: "var(--success)",      bg: "rgba(24,160,107,0.08)",  border: "rgba(24,160,107,0.2)"  },
  { label: "Social Hub",    icon: MessageCircle, path: "/social",          color: "#b07cd6",             bg: "rgba(176,124,214,0.08)", border: "rgba(176,124,214,0.18)" },
  { label: "Members",       icon: Users,         path: "/members",         color: "var(--fuel-500)",     bg: "rgba(204,91,48,0.08)",   border: "rgba(204,91,48,0.18)" },
];

export default function MemberTools() {
  return (
    <div className="space-y-2.5">
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Member Tools
      </p>
      <div className="grid grid-cols-3 gap-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all active:scale-95"
            style={{
              background: tool.bg,
              border: `1px solid ${tool.border}`,
              textDecoration: "none",
            }}
          >
            <tool.icon className="w-5 h-5 flex-shrink-0" style={{ color: tool.color }} />
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}>
              {tool.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}