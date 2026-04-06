"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogoWithText } from "@/components/Logo";

function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        <Link href="/">
          <LogoWithText size={32} />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="font-headline text-base font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="font-headline text-base font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            FAQ
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-gradient px-6 py-2.5 rounded-lg text-white font-headline font-semibold hover:opacity-90 transition-opacity active:scale-95 duration-200"
          >
            Check Eligibility
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-low w-full py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        <LogoWithText size={28} />
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Regulatory Info
          </a>
        </div>
        <div className="font-body text-sm text-on-surface-variant text-center md:text-right">
          &copy; {new Date().getFullYear()} Claimly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function HeroSection() {
  const router = useRouter();
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber.trim()) return;
    setLoading(true);
    const params = new URLSearchParams({ flight: flightNumber.trim().toUpperCase() });
    if (date) params.set("date", date);
    router.push(`/check?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <h1 className="font-headline text-5xl lg:text-7xl font-bold text-primary mb-6 leading-[1.1] tracking-[-0.02em]">
            Get up to <span className="text-tertiary">&euro;600</span> for
            your flight delay.
          </h1>
          <p className="font-body text-lg lg:text-xl text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
            EU law guarantees compensation for disrupted flights. Check your
            eligibility in seconds.{" "}
            <span className="font-semibold text-primary">No win, no fee.</span>
          </p>

          {/* Search form card */}
          <div className="bg-surface-card p-8 rounded-xl shadow-xl max-w-xl border border-outline-variant/15">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Flight number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LH123"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full h-14 bg-surface-low border-none rounded-lg px-4 text-on-surface font-body focus:ring-2 focus:ring-surface-tint focus:bg-surface-card transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Travel date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-14 bg-surface-low border-none rounded-lg px-4 text-on-surface font-body focus:ring-2 focus:ring-surface-tint focus:bg-surface-card transition-all outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 tertiary-gradient text-white font-headline font-bold text-lg rounded-lg shadow-lg shadow-tertiary/20 hover:opacity-95 transition-opacity active:scale-[0.98] duration-150 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Checking..." : "Check flight"}
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant text-sm font-medium font-body">
              <svg className="w-4 h-4 text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Free eligibility check &middot; No credit card required
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/hero-wing.jpg"
              alt="Aircraft wing above clouds"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
          {/* Badge */}
          <div className="absolute -bottom-6 -left-6 bg-surface-card p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-outline-variant/15">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-headline font-bold text-primary">
                EC261
              </div>
              <div className="text-sm font-body text-on-surface-variant">
                EU Protected Rights
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "€600", label: "Maximum compensation", highlight: false },
  { value: "3h", label: "Minimum delay", highlight: false },
  { value: "6 yrs", label: "Claim window", highlight: false },
  { value: "25%", label: "Only if you win", highlight: true },
];

function StatsSection() {
  return (
    <section className="bg-surface-low py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-card p-8 rounded-xl text-center shadow-sm border border-outline-variant/15"
            >
              <div
                className={`font-headline text-4xl font-extrabold mb-2 ${
                  stat.highlight ? "text-tertiary" : "text-primary"
                }`}
              >
                {stat.value}
              </div>
              <div className="font-body text-sm uppercase tracking-wider font-bold text-on-surface-variant">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Enter your flight",
    desc: "Type your flight number and travel date. We instantly verify delay records using our global flight database.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    accent: false,
  },
  {
    title: "We build your claim",
    desc: "Our system generates a professional compensation letter citing relevant EU regulations to ensure legal compliance.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    accent: false,
  },
  {
    title: "Get compensated",
    desc: "We submit the claim to the airline. You only pay a service fee when you receive your money in your bank account.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    accent: true,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-headline text-4xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto">
            We&apos;ve simplified the legal process into three effortless steps.
            Our legal tech does the heavy lifting while you wait for your payout.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-surface-high -z-10" />

          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl ${
                  step.accent
                    ? "bg-tertiary shadow-tertiary/20"
                    : "btn-gradient shadow-primary/20"
                }`}
              >
                {step.icon}
              </div>
              <h3 className="font-headline text-xl font-bold text-primary mb-4">
                {i + 1}. {step.title}
              </h3>
              <p className="font-body text-on-surface-variant leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "What is EC261?",
    a: "EU Regulation EC261/2004 entitles passengers to €250–€600 compensation when flights are delayed 3+ hours, cancelled, or overbooked. It applies to all flights departing EU airports, and EU airline flights arriving in the EU.",
  },
  {
    q: "How much does Claimly charge?",
    a: "Nothing upfront. We charge a 25% success fee only if you receive compensation. If we don\u2019t win, you don\u2019t pay.",
  },
  {
    q: "How far back can I claim?",
    a: "In most EU countries, you can claim flights from the past 3\u20136 years depending on jurisdiction.",
  },
  {
    q: "What information do I need?",
    a: "Your flight number, travel date, and basic passenger details. We handle everything else.",
  },
  {
    q: "How long does it take?",
    a: "Most airlines respond within 2\u20138 weeks. We follow up persistently until you receive what you\u2019re owed.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-surface-low">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-headline text-3xl font-bold text-primary">
            Frequently Asked Questions
          </h2>
          <div className="h-1.5 w-20 bg-tertiary mt-4 rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="bg-surface-card p-6 rounded-xl shadow-sm border border-outline-variant/15 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-headline font-bold text-primary">
                  {faq.q}
                </h4>
                <svg
                  className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 shrink-0 ml-4 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {openIndex === i && (
                <p className="mt-4 text-on-surface-variant font-body leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/cta-airport.jpg"
          alt="Airport terminal"
          fill
          className="object-cover opacity-10"
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-headline text-4xl lg:text-5xl font-bold text-primary mb-6">
          Check your flight now
        </h2>
        <p className="font-body text-lg text-on-surface-variant mb-10 max-w-lg mx-auto">
          It takes 30 seconds to find out if you&apos;re owed compensation.
          Join thousands of happy travelers.
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center btn-gradient text-white font-headline font-bold px-12 py-5 rounded-lg text-xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          Get started
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
