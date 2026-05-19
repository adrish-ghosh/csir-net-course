import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  Check,
  Copy,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { BRAND, IMAGES, PRICING_INCLUDES } from "../lib/constants";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api`;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const Pricing = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handlePayment = async () => {
    // Placeholder Razorpay handler — to be wired later
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill your name, email and phone before proceeding.");
      return;
    }
    await submitLead({ silent: true });
    toast.success("Redirecting to UPI / Razorpay... (Placeholder — wire real keys to enable live payments.)");
  };

  const submitLead = async (opts = {}) => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill all required fields.");
      return false;
    }
    try {
      setSubmitting(true);
      await axios.post(`${API}/leads`, form);
      if (!opts.silent) {
        toast.success("You're in! We'll reach out within 24 hours.");
        setForm({ name: "", email: "", phone: "", message: "" });
      }
      return true;
    } catch (e) {
      const detail = e?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not submit. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.upiId);
      toast.success("UPI ID copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <section id="pricing" data-testid="pricing-section" className="relative py-24 md:py-32">
      <div className="orb bg-cyan-500/20 w-[460px] h-[460px] -top-20 right-0" />
      <div className="orb bg-yellow-500/10 w-[360px] h-[360px] bottom-0 -left-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="max-w-3xl">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] font-medium text-cyan-400">
            Enrollment
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Limited Seats.{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Serious aspirants only.
            </span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed">
            Reserve your seat for the CSIR NET Dec 2026 batch. Monthly UPI mandate — cancel anytime.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pricing card */}
          <motion.div
            {...fadeUp}
            data-testid="pricing-card"
            className="lg:col-span-7 rounded-3xl p-8 md:p-10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-cyan-400/30 shadow-[0_8px_40px_rgba(6,182,212,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-400/30 text-yellow-200 text-[11px] font-medium uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Best Value
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <IndianRupee className="w-7 h-7 text-cyan-300 mb-1" />
              <span data-testid="price-amount" className="font-display text-6xl sm:text-7xl font-bold text-white tracking-tight leading-none">
                1500
              </span>
              <span className="text-slate-400 text-base ml-2">/ month</span>
            </div>
            <p className="mt-3 text-slate-300 text-sm">
              All-inclusive. No hidden fees. Cancel anytime.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRICING_INCLUDES.map((p, i) => (
                <div key={i} data-testid={`pricing-include-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 grid place-items-center rounded-full bg-cyan-400/15 border border-cyan-400/30">
                    <Check className="w-3 h-3 text-cyan-300" />
                  </span>
                  <span className="text-sm text-slate-200">{p}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                data-testid="razorpay-button"
                onClick={handlePayment}
                disabled={submitting}
                className="pulse-cta group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Subscribe with Razorpay / UPI
              </button>

              <a
                href={`upi://pay?pa=${BRAND.upiId}&pn=Adrish%20Ghosh&am=1500&cu=INR&tn=CSIR%20NET%20Dec%202026`}
                data-testid="upi-deeplink-button"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                Pay ₹1500 via UPI App
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                256-bit Secure
              </span>
              <span>•</span>
              <span>Monthly UPI Autopay supported</span>
              <span>•</span>
              <span>Instant access after payment</span>
            </div>
          </motion.div>

          {/* UPI + Lead capture */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              {...fadeUp}
              data-testid="upi-card"
              className="rounded-3xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-medium">UPI Direct</div>
                  <div className="mt-1 font-display text-xl font-semibold text-white">Scan to Pay</div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] uppercase tracking-wider">
                  GPay · PhonePe · Paytm
                </span>
              </div>

              <div className="mt-5 flex items-center justify-center">
                <div className="relative p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <img src={IMAGES.qr} alt="UPI QR Code" className="w-44 h-44 object-cover rounded-xl" />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] bg-yellow-400 text-black font-semibold">
                    ₹1500
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-black/30 border border-white/10 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">UPI ID</div>
                  <div data-testid="upi-id-display" className="text-sm text-white font-mono truncate">{BRAND.upiId}</div>
                </div>
                <button
                  data-testid="copy-upi-button"
                  onClick={copyUpi}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-xs hover:bg-cyan-500/25"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>

              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                After payment, fill the form below so we can confirm your enrollment and send batch access within 24 hours.
              </p>
            </motion.div>

            <motion.form
              {...fadeUp}
              onSubmit={(e) => {
                e.preventDefault();
                submitLead();
              }}
              data-testid="lead-form"
              className="rounded-3xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10"
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-medium">Reserve Your Seat</div>
              <div className="mt-1 font-display text-xl font-semibold text-white">Quick enrollment form</div>

              <div className="mt-5 flex flex-col gap-3">
                <input
                  data-testid="lead-name-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
                />
                <input
                  data-testid="lead-email-input"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
                />
                <input
                  data-testid="lead-phone-input"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone (WhatsApp preferred)"
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
                />
                <textarea
                  data-testid="lead-message-input"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Anything we should know? (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 resize-none"
                />
              </div>

              <button
                data-testid="lead-submit-button"
                type="submit"
                disabled={submitting}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 transition-all"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Submit Enrollment Request
              </button>
              <p className="mt-3 text-[11px] text-slate-500 text-center">
                We respect your privacy. No spam — only batch communication.
              </p>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};
