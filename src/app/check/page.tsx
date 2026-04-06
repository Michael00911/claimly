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
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
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
        if (data.error) setError(data.error);
        else setResult(data);
      })
      .catch(() => setError("Failed to check flight. Please try again."))
      .finally(() => setLoading(false));
  }, [flightNumber, date]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex items-center max-w-7xl mx-auto px-6 h-20">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-headline">
            Claimly
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-20 max-w-2xl mx-auto px-6 py-16 w-full">
        {loading && (
          <div className="flex flex-col items-center py-24">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="mt-4 font-body text-on-surface-variant">
              Checking {flightNumber}...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-error-subtle p-6 border border-error/10">
            <p className="font-body font-medium text-error">{error}</p>
            <Link href="/" className="mt-3 inline-block font-body text-sm text-primary hover:underline">
              &larr; Try another flight
            </Link>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {result.isDemo && (
              <div className="rounded-xl bg-surface-card px-5 py-3 border border-outline-variant/15 shadow-sm">
                <p className="font-body text-sm text-on-surface-variant">
                  Demo mode &mdash; using simulated data.
                </p>
              </div>
            )}

            {/* Flight card */}
            <div className="bg-surface-card rounded-xl p-8 shadow-md border border-outline-variant/15">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold text-primary">
                  {result.flight.flightNumber}
                </h2>
                <span className="font-body text-sm text-on-surface-variant">
                  {result.flight.airline}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-on-surface-variant">From</p>
                  <p className="mt-1 font-body text-on-surface">{result.flight.departureAirport}</p>
                </div>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-on-surface-variant">To</p>
                  <p className="mt-1 font-body text-on-surface">{result.flight.arrivalAirport}</p>
                </div>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-on-surface-variant">Scheduled</p>
                  <p className="mt-1 font-body text-on-surface">
                    {new Date(result.flight.scheduledArrival).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-on-surface-variant">Actual</p>
                  <p className="mt-1 font-body text-on-surface">
                    {result.flight.status === "cancelled"
                      ? "Cancelled"
                      : new Date(result.flight.actualArrival).toLocaleString()}
                  </p>
                </div>
              </div>

              {result.eligibility.delayMinutes > 0 && (
                <div className="mt-6 pt-6 border-t border-outline-variant/15">
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-on-surface-variant">Delay</p>
                  <p className="mt-1 font-headline text-3xl font-bold text-error">
                    {Math.floor(result.eligibility.delayMinutes / 60)}h{" "}
                    {result.eligibility.delayMinutes % 60}m
                  </p>
                </div>
              )}

              {result.flight.status === "cancelled" && (
                <div className="mt-6 pt-6 border-t border-outline-variant/15">
                  <p className="font-headline text-xl font-bold text-error">Flight Cancelled</p>
                </div>
              )}
            </div>

            {/* Result */}
            {result.eligibility.eligible ? (
              <div className="bg-surface-card rounded-xl p-8 shadow-md border border-tertiary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-primary">
                      You could be owed &euro;{result.eligibility.compensationEur}
                    </h3>
                    <p className="mt-2 font-body text-on-surface-variant leading-relaxed">
                      {result.eligibility.reason}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/claim?flight=${flightNumber}${date ? `&date=${date}` : ""}`}
                  className="mt-6 flex items-center justify-center h-14 tertiary-gradient text-white font-headline font-bold text-lg rounded-lg shadow-lg shadow-tertiary/20 hover:opacity-95 active:scale-[0.98] transition-all duration-150"
                >
                  Start my claim
                </Link>

                <p className="mt-3 text-center font-body text-sm text-on-surface-variant">
                  No win, no fee &middot; 25% success fee
                </p>
              </div>
            ) : (
              <div className="bg-surface-card rounded-xl p-8 shadow-sm border border-outline-variant/15">
                <h3 className="font-headline text-xl font-bold text-primary">Not eligible</h3>
                <p className="mt-2 font-body text-on-surface-variant leading-relaxed">
                  {result.eligibility.reason}
                </p>
                <Link
                  href="/"
                  className="mt-6 flex items-center justify-center h-12 rounded-lg font-headline font-semibold text-primary border border-outline-variant/15 hover:bg-surface-low transition-colors"
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
