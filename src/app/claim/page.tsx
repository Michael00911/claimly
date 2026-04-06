"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { FlightInfo, EligibilityResult } from "@/lib/ec261";

interface CheckResult {
  flight: FlightInfo;
  eligibility: EligibilityResult;
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
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

  const handleCopyLetter = () => {
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
    "w-full h-11 px-4 rounded-[10px] bg-surface text-[15px] text-foreground placeholder:text-muted-2 shadow-sm ring-1 ring-ring focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow duration-200";

  return (
    <>
      <header className="w-full backdrop-blur-md bg-surface/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-foreground">
            Claimly
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto px-6 py-16 w-full">
        {/* Flight summary pill */}
        {flightData && (
          <div className="rounded-xl bg-surface px-4 py-3 shadow-sm ring-1 ring-ring flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-foreground">
                {flightData.flight.flightNumber}
              </span>
              <span className="text-[13px] text-muted">{flightData.flight.airline}</span>
            </div>
            <span className="text-[15px] font-semibold text-success">
              &euro;{flightData.eligibility.compensationEur}
            </span>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-foreground">
              Your details
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              We&apos;ll use this to generate your compensation letter.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
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

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
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

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
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

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
                  Booking reference
                  <span className="text-muted-2 font-normal ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="ABC123"
                  className={inputClass}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-[10px] bg-primary text-white text-[15px] font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Generate claim letter
                </button>
              </div>

              <p className="text-[13px] text-center text-muted-2">
                Free &middot; No payment required
              </p>
            </form>
          </div>
        )}

        {/* Generating */}
        {step === "generating" && (
          <div className="flex flex-col items-center py-24">
            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <p className="mt-4 text-[15px] text-muted">
              Generating your claim letter...
            </p>
          </div>
        )}

        {/* Letter */}
        {step === "letter" && (
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-foreground">
              Your claim letter
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Review, then copy or download to send to the airline.
            </p>

            <div className="mt-6 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring">
              <pre className="whitespace-pre-wrap text-[14px] text-foreground-secondary font-sans leading-[1.7]">
                {letter}
              </pre>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopyLetter}
                className="flex-1 h-11 rounded-[10px] text-[15px] font-medium text-foreground ring-1 ring-ring hover:ring-border-strong hover:shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 h-11 rounded-[10px] bg-primary text-white text-[15px] font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Download .txt
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring">
              <h3 className="text-[15px] font-semibold text-foreground">Next steps</h3>
              <ol className="mt-3 space-y-2 text-[14px] text-muted list-decimal list-inside leading-relaxed">
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
              className="mt-6 block text-[13px] text-accent hover:underline"
            >
              &larr; Check another flight
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
