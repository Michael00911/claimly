"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { FlightInfo, EligibilityResult } from "@/lib/ec261";

interface CheckResult {
  flight: FlightInfo;
  eligibility: EligibilityResult;
  isDemo: boolean;
}

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      }
    >
      <CheckContent />
    </Suspense>
  );
}

function CheckContent() {
  const searchParams = useSearchParams();
  const flightNumber = searchParams.get("flight");
  const date = searchParams.get("date");

  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flightNumber) {
      setError("No flight number provided.");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({ flight: flightNumber });
    if (date) params.set("date", date);

    fetch(`/api/check-flight?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data);
        }
      })
      .catch(() => setError("Failed to check flight. Please try again."))
      .finally(() => setLoading(false));
  }, [flightNumber, date]);

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
        {loading && (
          <div className="flex flex-col items-center py-24">
            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <p className="mt-4 text-[15px] text-muted">
              Checking {flightNumber}...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-danger-subtle p-6 ring-1 ring-danger/10">
            <p className="text-[15px] font-medium text-danger">{error}</p>
            <Link
              href="/"
              className="mt-3 inline-block text-[13px] text-accent hover:underline"
            >
              &larr; Try another flight
            </Link>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            {result.isDemo && (
              <div className="rounded-xl bg-warning-subtle px-4 py-3 ring-1 ring-warning/10">
                <p className="text-[13px] text-warning">
                  Demo mode &mdash; using simulated data.
                </p>
              </div>
            )}

            {/* Flight card */}
            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                  {result.flight.flightNumber}
                </h2>
                <span className="text-[13px] text-muted">
                  {result.flight.airline}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[12px] font-medium text-muted-2 uppercase tracking-wide">
                    From
                  </p>
                  <p className="mt-0.5 text-[15px] text-foreground-secondary">
                    {result.flight.departureAirport}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-muted-2 uppercase tracking-wide">
                    To
                  </p>
                  <p className="mt-0.5 text-[15px] text-foreground-secondary">
                    {result.flight.arrivalAirport}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-muted-2 uppercase tracking-wide">
                    Scheduled
                  </p>
                  <p className="mt-0.5 text-[15px] text-foreground-secondary">
                    {new Date(result.flight.scheduledArrival).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-muted-2 uppercase tracking-wide">
                    Actual
                  </p>
                  <p className="mt-0.5 text-[15px] text-foreground-secondary">
                    {result.flight.status === "cancelled"
                      ? "Cancelled"
                      : new Date(result.flight.actualArrival).toLocaleString()}
                  </p>
                </div>
              </div>

              {result.eligibility.delayMinutes > 0 && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-[12px] font-medium text-muted-2 uppercase tracking-wide">
                    Delay
                  </p>
                  <p className="mt-0.5 text-[24px] font-semibold tracking-tight text-danger">
                    {Math.floor(result.eligibility.delayMinutes / 60)}h{" "}
                    {result.eligibility.delayMinutes % 60}m
                  </p>
                </div>
              )}

              {result.flight.status === "cancelled" && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-[17px] font-semibold text-danger">
                    Flight Cancelled
                  </p>
                </div>
              )}
            </div>

            {/* Result */}
            {result.eligibility.eligible ? (
              <div className="rounded-2xl bg-success-subtle p-6 ring-1 ring-success/10">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-foreground">
                      You could be owed &euro;{result.eligibility.compensationEur}
                    </h3>
                    <p className="mt-1 text-[15px] text-muted leading-relaxed">
                      {result.eligibility.reason}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/claim?flight=${flightNumber}${date ? `&date=${date}` : ""}`}
                  className="mt-5 flex items-center justify-center h-11 rounded-[10px] bg-primary text-white text-[15px] font-medium hover:bg-primary-hover active:scale-[0.98] transition-all duration-200"
                >
                  Start my claim
                </Link>

                <p className="mt-3 text-center text-[13px] text-muted">
                  No win, no fee &middot; 25% success fee
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ring">
                <h3 className="text-[17px] font-semibold text-foreground">
                  Not eligible
                </h3>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">
                  {result.eligibility.reason}
                </p>

                <Link
                  href="/"
                  className="mt-5 flex items-center justify-center h-11 rounded-[10px] text-foreground text-[15px] font-medium ring-1 ring-ring hover:ring-border-strong hover:shadow-sm transition-all duration-200"
                >
                  Check another flight
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
