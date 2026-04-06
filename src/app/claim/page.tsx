"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogoWithText } from "@/components/Logo";
import type { FlightInfo, EligibilityResult } from "@/lib/ec261";

interface CheckResult {
  flight: FlightInfo;
  eligibility: EligibilityResult;
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <ClaimContent />
    </Suspense>
  );
}

function ClaimContent() {
  const searchParams = useSearchParams();
  const flightNumber = searchParams.get("flight") || "";
  const date = searchParams.get("date") || "";

  const [flightData, setFlightData] = useState<CheckResult | null>(null);
  const [step, setStep] = useState<"form" | "generating" | "letter">("form");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    if (!flightNumber) return;
    const params = new URLSearchParams({ flight: flightNumber });
    if (date) params.set("date", date);

    fetch(`/api/check-flight?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setFlightData(data);
      });
  }, [flightNumber, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightData) return;
    setStep("generating");

    const res = await fetch("/api/generate-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flightNumber: flightData.flight.flightNumber,
        airline: flightData.flight.airline,
        departureAirport: flightData.flight.departureAirport,
        arrivalAirport: flightData.flight.arrivalAirport,
        scheduledDate: flightData.flight.scheduledDeparture.split("T")[0],
        delayMinutes: flightData.eligibility.delayMinutes,
        compensationEur: flightData.eligibility.compensationEur,
        status: flightData.flight.status,
        passengerName: name,
        passengerEmail: email,
        passengerAddress: address,
        bookingReference: bookingRef || undefined,
      }),
    });

    const data = await res.json();
    setLetter(data.letter);
    setStep("letter");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim-${flightNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "w-full h-14 bg-surface-low border-none rounded-lg px-4 text-on-surface font-body focus:ring-2 focus:ring-surface-tint focus:bg-surface-card transition-all outline-none";

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex items-center max-w-7xl mx-auto px-6 h-20">
          <Link href="/">
            <LogoWithText size={32} />
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-20 max-w-2xl mx-auto px-6 py-16 w-full">
        {/* Flight summary */}
        {flightData && (
          <div className="bg-surface-card rounded-xl px-6 py-4 shadow-sm border border-outline-variant/15 flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-primary">
                {flightData.flight.flightNumber}
              </span>
              <span className="font-body text-sm text-on-surface-variant">
                {flightData.flight.airline}
              </span>
            </div>
            <span className="font-headline font-bold text-tertiary">
              &euro;{flightData.eligibility.compensationEur}
            </span>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary">
              Your details
            </h1>
            <p className="mt-2 font-body text-on-surface-variant">
              We&apos;ll use this to generate your compensation letter.
            </p>

            <div className="mt-8 bg-surface-card p-8 rounded-xl shadow-md border border-outline-variant/15">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Home address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, London, UK"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-sm font-semibold text-on-surface-variant">
                    Booking reference{" "}
                    <span className="font-normal text-outline-variant">optional</span>
                  </label>
                  <input
                    type="text"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    placeholder="ABC123"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 tertiary-gradient text-white font-headline font-bold text-lg rounded-lg shadow-lg shadow-tertiary/20 hover:opacity-95 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  Generate claim letter
                </button>

                <p className="font-body text-sm text-center text-on-surface-variant">
                  Free &middot; No payment required
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Generating */}
        {step === "generating" && (
          <div className="flex flex-col items-center py-24">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="mt-4 font-body text-on-surface-variant">
              Generating your claim letter...
            </p>
          </div>
        )}

        {/* Letter */}
        {step === "letter" && (
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary">
              Your claim letter
            </h1>
            <p className="mt-2 font-body text-on-surface-variant">
              Review, then copy or download to send to the airline.
            </p>

            <div className="mt-6 bg-surface-card rounded-xl p-8 shadow-md border border-outline-variant/15">
              <pre className="whitespace-pre-wrap text-sm text-on-surface font-body leading-[1.8]">
                {letter}
              </pre>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 h-12 rounded-lg font-headline font-semibold text-primary border border-outline-variant/15 hover:bg-surface-low active:scale-[0.98] transition-all cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 h-12 rounded-lg btn-gradient text-white font-headline font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                Download .txt
              </button>
            </div>

            <div className="mt-8 bg-surface-card rounded-xl p-8 shadow-sm border border-outline-variant/15">
              <h3 className="font-headline font-bold text-primary">Next steps</h3>
              <ol className="mt-4 space-y-3 font-body text-sm text-on-surface-variant list-decimal list-inside leading-relaxed">
                <li>Review and personalize the letter if needed</li>
                <li>
                  Send to {flightData?.flight.airline || "the airline"}&apos;s
                  customer service email
                </li>
                <li>Wait for their response (typically 2&ndash;8 weeks)</li>
                <li>If they refuse or ignore, we can help escalate</li>
              </ol>
            </div>

            <Link
              href="/"
              className="mt-6 block font-body text-sm text-primary hover:underline"
            >
              &larr; Check another flight
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
