"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          Claimly
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-muted hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#faq" className="text-muted hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Claimly. All rights reserved.</p>
        <p>
          EU Regulation EC261/2004 entitles you to up to &euro;600 for flight
          disruptions.
        </p>
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
    <section className="w-full bg-gradient-to-b from-primary-light/50 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Flight Delayed?
          <br />
          <span className="text-primary">Get Up to &euro;600</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto">
          EU law guarantees compensation for delayed or cancelled flights.
          Enter your flight number &mdash; we&apos;ll handle the rest.
          <strong> No win, no fee.</strong>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
        >
          <input
            type="text"
            placeholder="e.g. LH1234"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="w-full sm:w-auto flex-1 h-12 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-auto h-12 px-4 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Checking..." : "Check My Flight"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Free check &middot; Takes 30 seconds &middot; No credit card required
        </p>
      </div>
    </section>
  );
}

const steps = [
  {
    num: "1",
    title: "Enter Your Flight",
    desc: "Type your flight number and travel date. We instantly check if your flight qualifies.",
  },
  {
    num: "2",
    title: "We Build Your Claim",
    desc: "Our AI generates a professional compensation letter tailored to your specific situation.",
  },
  {
    num: "3",
    title: "Get Compensated",
    desc: "We submit your claim to the airline. You only pay when you receive your money.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-center text-foreground">
          How It Works
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto">
                {step.num}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "€250–600", label: "Compensation per passenger" },
  { value: "3+ hours", label: "Delay threshold" },
  { value: "6 years", label: "You can claim back" },
  { value: "No win", label: "No fee" },
];

function StatsSection() {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted">{stat.label}</div>
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
    a: "EU Regulation EC261/2004 is a law that entitles passengers to compensation of €250–€600 when their flight is delayed by 3+ hours, cancelled, or overbooked. It applies to all flights departing from EU airports, and flights arriving in the EU on EU-based airlines.",
  },
  {
    q: "How much does Claimly charge?",
    a: "Nothing upfront. We only charge a 25% success fee if you receive compensation. If we don't win, you don't pay.",
  },
  {
    q: "How far back can I claim?",
    a: "In most EU countries, you can claim for flights up to 3–6 years ago, depending on the country. Enter your flight details and we'll let you know.",
  },
  {
    q: "What do I need to file a claim?",
    a: "Just your flight number, travel date, and basic passenger details (name, email, address). We handle everything else.",
  },
  {
    q: "How long does it take to get compensated?",
    a: "Most airlines respond within 2–8 weeks. Some may take longer, but we follow up persistently until you get what you're owed.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="w-full bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-foreground">{faq.q}</h3>
              <p className="mt-2 text-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
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
      </main>
      <Footer />
    </>
  );
}
