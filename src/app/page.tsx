"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Header() {
  return (
    <header className="w-full backdrop-blur-md bg-surface/80 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-foreground">
          Claimly
        </Link>
        <nav className="flex items-center gap-6 text-[13px]">
          <a
            href="#how-it-works"
            className="text-muted hover:text-foreground transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-muted hover:text-foreground transition-colors duration-200"
          >
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start justify-between gap-4 text-[13px] text-muted-2">
        <p>&copy; {new Date().getFullYear()} Claimly</p>
        <p>EU Regulation EC261/2004</p>
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
    <section className="w-full pt-20 sm:pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium text-accent tracking-wide uppercase">
            EU Flight Compensation
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.035em] leading-[1.1] text-foreground">
            Your flight was delayed.
            <br />
            Get up to &euro;600 back.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted max-w-lg">
            EU law guarantees compensation for disrupted flights.
            Check your eligibility in seconds. No win, no fee.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
        >
          <input
            type="text"
            placeholder="Flight number, e.g. LH1234"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="flex-1 h-11 px-4 rounded-[10px] bg-surface text-foreground text-[15px] placeholder:text-muted-2 shadow-sm ring-1 ring-ring focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow duration-200"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="sm:w-44 h-11 px-4 rounded-[10px] bg-surface text-foreground text-[15px] shadow-sm ring-1 ring-ring focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-[10px] bg-primary text-white text-[15px] font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {loading ? "Checking..." : "Check flight"}
          </button>
        </form>

        <p className="mt-4 text-[13px] text-muted-2">
          Free eligibility check &middot; No credit card required
        </p>
      </div>
    </section>
  );
}

const stats = [
  { value: "€600", label: "Maximum compensation" },
  { value: "3h", label: "Minimum delay" },
  { value: "6 yrs", label: "Claim window" },
  { value: "25%", label: "Only if you win" },
];

function StatsSection() {
  return (
    <section className="w-full py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring"
            >
              <p className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[13px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: "01",
    title: "Enter your flight",
    desc: "Type your flight number and travel date. We instantly verify delay records and check qualification.",
  },
  {
    num: "02",
    title: "We build your claim",
    desc: "Our system generates a professional compensation letter citing the relevant EU regulations.",
  },
  {
    num: "03",
    title: "Get compensated",
    desc: "We submit the claim to the airline on your behalf. You only pay when you receive your money.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-[13px] font-medium text-accent tracking-wide uppercase">
          Process
        </p>
        <h2 className="mt-2 text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] text-foreground">
          Three steps to your money
        </h2>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring hover:shadow-md hover:ring-border-strong transition-all duration-300"
            >
              <span className="text-[13px] font-mono text-muted-2">{step.num}</span>
              <h3 className="mt-3 text-[17px] font-semibold text-foreground tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
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
    a: "In most EU countries, you can claim flights from the past 3\u20136 years depending on jurisdiction. Enter your flight details to find out.",
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
  return (
    <section id="faq" className="w-full py-20">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[13px] font-medium text-accent tracking-wide uppercase">
          FAQ
        </p>
        <h2 className="mt-2 text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] text-foreground">
          Common questions
        </h2>

        <div className="mt-12 space-y-0 divide-y divide-border">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-6">
              <h3 className="text-[15px] font-medium text-foreground">{faq.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl bg-foreground p-10 sm:p-14 text-center">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] text-white">
            Check your flight now
          </h2>
          <p className="mt-3 text-[15px] text-white/60 max-w-md mx-auto">
            It takes 30 seconds to find out if you&apos;re owed compensation.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-6 inline-flex h-11 items-center px-6 rounded-[10px] bg-white text-foreground text-[15px] font-medium hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
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
