import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, DollarSign, Calendar, TrendingUp } from "lucide-react";

function calcFee(daysPerMonth) {
  if (daysPerMonth >= 365 / 12) return 100000;
  if (daysPerMonth >= 181 / 12 * 1) {
    if (daysPerMonth <= 30) return 325 * daysPerMonth * 12;
    if (daysPerMonth <= 90 / 12 * 1) return 320 * daysPerMonth * 12;
  }
  // Simplified tier lookup
  const annualDays = Math.round(daysPerMonth * 12);
  if (annualDays <= 30) return annualDays * 325;
  if (annualDays <= 90) return annualDays * 320;
  if (annualDays <= 180) return annualDays * 305;
  if (annualDays <= 364) return annualDays * 295;
  return 100000;
}

export default function OneHomeCalculator({ onBack }) {
  const [step, setStep] = useState(1);
  const [rent, setRent] = useState(1500);
  const [utilities, setUtilities] = useState(300);
  const [services, setServices] = useState(200);
  const [roadDays, setRoadDays] = useState(250);

  const monthlyCost = rent + utilities + services;
  const annualCost = monthlyCost * 12;
  const homeDays = 365 - roadDays;
  const costPerDayHome = homeDays > 0 ? Math.round(annualCost / homeDays) : 0;

  const annualDays = Math.min(365, Math.max(1, roadDays));
  const baseFee = calcFee(Math.round(annualDays / 12));
  const eaFee = Math.round(baseFee * 0.661);
  const dailyRate = 19;
  const annualOneHomeCost = annualDays * dailyRate;

  const reductionFraction = 0.8;
  const savings = Math.round((annualCost * reductionFraction) - annualOneHomeCost);

  const pay12 = Math.round((eaFee * 1.2) / 12);
  const pay24 = Math.round((eaFee * 1.2) / 24);

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to OneHome
      </button>

      <div className="bg-onehome-bg text-white rounded-2xl p-5 text-center">
        <p className="text-onehome-accent text-xs font-semibold uppercase tracking-widest">Lifestyle Calculator</p>
        <h2 className="font-heading text-xl font-bold mt-1">See Your Savings</h2>
        <div className="flex justify-center gap-4 mt-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-1 rounded-full ${step >= s ? "bg-onehome-accent" : "bg-white/20"}`} />
          ))}
        </div>
      </div>

      {/* Step 1: Home Costs */}
      {step === 1 && (
        <Card>
          <CardContent className="p-5 space-y-5">
            <h3 className="font-heading font-bold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-onehome-accent" />
              Your Home Today
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Rent / Mortgage</span>
                  <span className="font-semibold">${rent.toLocaleString()}/mo</span>
                </div>
                <Slider value={[rent]} onValueChange={([v]) => setRent(v)} min={0} max={5000} step={50} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Utilities</span>
                  <span className="font-semibold">${utilities}/mo</span>
                </div>
                <Slider value={[utilities]} onValueChange={([v]) => setUtilities(v)} min={0} max={1000} step={25} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Insurance, Taxes, Maintenance</span>
                  <span className="font-semibold">${services}/mo</span>
                </div>
                <Slider value={[services]} onValueChange={([v]) => setServices(v)} min={0} max={2000} step={25} />
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Monthly Total</span>
                <span className="text-destructive">${monthlyCost.toLocaleString()}/mo</span>
              </div>
            </div>
            <Button className="w-full bg-onehome-accent hover:bg-onehome-accent/90 text-white" onClick={() => setStep(2)}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Road Schedule */}
      {step === 2 && (
        <Card>
          <CardContent className="p-5 space-y-5">
            <h3 className="font-heading font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-onehome-accent" />
              Road Schedule
            </h3>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Days on the road per year</span>
                <span className="font-semibold">{roadDays} days</span>
              </div>
              <Slider value={[roadDays]} onValueChange={([v]) => setRoadDays(v)} min={100} max={340} step={5} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{homeDays} days at home</span>
                <span>{roadDays} days on road</span>
              </div>
            </div>

            <div className="bg-destructive/10 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">You're paying for a home you use</p>
              <p className="font-heading text-3xl font-bold text-destructive">{homeDays} days/year</p>
              <p className="text-xs text-muted-foreground mt-1">That's <strong>${costPerDayHome}/day</strong> for each day you're actually home</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-onehome-accent hover:bg-onehome-accent/90 text-white" onClick={() => setStep(3)}>
                See Results <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="bg-onehome-bg text-white">
            <CardContent className="p-5 text-center">
              <p className="text-onehome-accent text-xs font-semibold uppercase tracking-widest">Your OneHome Plan</p>
              <p className="font-heading text-5xl font-bold text-white mt-2">$19<span className="text-xl">/day</span></p>
              <p className="text-white/50 text-xs mt-1">Resort-quality living, everywhere the road takes you</p>
            </CardContent>
          </Card>

          {savings > 0 && (
            <Card className="border-lhs-green/30">
              <CardContent className="p-5 text-center">
                <TrendingUp className="w-8 h-8 text-lhs-green mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Estimated annual savings</p>
                <p className="font-heading text-3xl font-bold text-lhs-green">${savings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Based on your inputs. Actual savings may vary.</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading font-semibold text-sm">Early Adopter Membership</h3>
              <p className="text-xs text-muted-foreground">West Memphis founding members get 34% off. Fully refundable.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span>Pay in Full</span>
                  <span className="font-semibold">${eaFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span>12-Month Plan</span>
                  <span className="font-semibold">${pay12.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted">
                  <span>24-Month Plan</span>
                  <span className="font-semibold">${pay24.toLocaleString()}/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1 bg-onehome-accent hover:bg-onehome-accent/90 text-white" asChild>
              <a href="tel:6028588000">Call JJ — 602-858-8000</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}