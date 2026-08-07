import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Target, Trophy, ParkingCircle, DollarSign, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const UNLOCK_CARDS = [
  {
    icon: Target,
    color: "#C85A2A",
    title: "Career Center",
    description: "Access exclusive job postings, carrier connections, and driving opportunities built for members only.",
  },
  {
    icon: Trophy,
    color: "#F5A623",
    title: "Top 10 Truckers",
    description: "Get ranked, get recognized, and earn your place among the best American truckers on the network.",
  },
  {
    icon: ParkingCircle,
    color: "#4A90D9",
    title: "Reserve Your Space",
    description: "Book premium, gated, secured parking at LineHaul Station terminals — by the day, your way.",
  },
  {
    icon: DollarSign,
    color: "#2ECC71",
    title: "Founding Member Pricing",
    description: "You'll be first to see terminal pricing, launch specials, and member-only rates before anyone else.",
  },
  {
    icon: Home,
    color: "#C85A2A",
    title: "OneHome Program",
    description: "Replace $20K+ in annual housing costs with resort-quality living on the road — your Home Hub awaits.",
  },
];

export default function Welcome() {
  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get("id");

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) { setLoading(false); return; }
    base44.entities.Driver.get(driverId)
      .then((result) => { if (result) setDriver(result); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [driverId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A2A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Subtle radial glow at top */}
      <div className="absolute inset-x-0 top-0 h-96 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(200,90,42,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-5 py-14 space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-[#C85A2A] text-xs font-heading font-bold uppercase tracking-[0.25em]">
            LineHaul Station
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
            {driver ? (
              <>You're in, {driver.first_name}.<br />
              <span className="text-[#C85A2A]">Welcome to LineHaul Station.</span></>
            ) : (
              <>You're in.<br />
              <span className="text-[#C85A2A]">Welcome to LineHaul Station.</span></>
            )}
          </h1>
          <p className="text-white/55 text-base max-w-md mx-auto leading-relaxed">
            Your membership is being activated. Here's what's coming your way.
          </p>
        </motion.div>

        {/* Unlock Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UNLOCK_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
              className={`relative rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 overflow-hidden ${i === 4 ? "sm:col-span-2" : ""}`}
            >
              {/* Faint color tint behind icon */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: card.color }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.color}22`, border: `1px solid ${card.color}44` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">{card.title}</h3>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="flex flex-col items-center gap-4 pt-2"
        >
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-[#C85A2A] hover:bg-[#b04e24] text-white font-heading font-bold text-base transition-colors"
          >
            Enter the Portal <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-xs text-white/25 text-center">
            Questions? Reply to your activation email or reach us at{" "}
            <a href="mailto:lulu@linehaul-station.com" className="text-[#C85A2A]">
              lulu@linehaul-station.com
            </a>
          </p>
        </motion.div>

      </div>
    </div>
  );
}