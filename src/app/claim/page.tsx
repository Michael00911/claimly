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
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  // Fetch flight data on mount
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

  return (
    <>
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Claimly
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Flight summary */}
        {flightData && (
          <div className="border border-border rounded-lg p-4 mb-8 flex items-center justify-between">
            <div>
              <span className="font-bold">{flightData.flight.flightNumber}</span>
              <span className="text-muted mx-2">&middot;</span>
              <span className="text-sm text-muted">{flightData.flight.airline}</span>
            </div>
            <div className="text-right">
              <span className="text-success font-bold">
                &euro;{flightData.eligibility.compensationEur}
              </span>
              <span className="text-sm text-muted ml-2">potential</span>
            </div>
          </div>
        )}

        {/* Step 1: Form */}
        {step === "form" && (
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Start Your Claim
            </h1>
            <p className="mt-2 text-muted">
              Fill in your details below. We&apos;ll generate a professional
              compensation letter you can send to the airline.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full h-11 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full h-11 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Home Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, London, UK"
                  className="w-full h-11 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Booking Reference (optional)
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="ABC123"
                  className="w-full h-11 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Generate My Claim Letter
              </button>

              <p className="text-sm text-center text-muted">
                No payment required. No win, no fee.
              </p>
            </form>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === "generating" && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted">
              Generating your claim letter with AI...
            </p>
          </div>
        )}

        {/* Step 3: Letter */}
        {step === "letter" && (
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Your Claim Letter
            </h1>
            <p className="mt-2 text-muted">
              Review the letter below, then copy or download it to send to the
              airline.
            </p>

            <div className="mt-6 border border-border rounded-lg bg-white p-6">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                {letter}
              </pre>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopyLetter}
                className="flex-1 h-11 rounded-lg border border-border text-foreground font-medium hover:bg-card transition-colors cursor-pointer"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Download as .txt
              </button>
            </div>

            <div className="mt-8 border border-border rounded-lg p-6 bg-card">
              <h3 className="font-semibold text-foreground">What&apos;s Next?</h3>
              <ol className="mt-3 space-y-2 text-sm text-muted list-decimal list-inside">
                <li>Review and personalize the letter if needed</li>
                <li>
                  Send it to {flightData?.flight.airline || "the airline"}&apos;s
                  customer service email
                </li>
                <li>Wait for their response (usually 2-8 weeks)</li>
                <li>
                  If they refuse or don&apos;t respond, contact us for escalation
                  support
                </li>
              </ol>
            </div>

            <Link
              href="/"
              className="mt-6 block text-center text-primary hover:underline"
            >
              &larr; Check another flight
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
