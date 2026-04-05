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
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Claimly
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted">
              Checking flight {flightNumber}...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-6 text-center">
            <p className="text-danger font-medium">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              &larr; Try another flight
            </Link>
          </div>
        )}

        {result && (
          <div>
            {result.isDemo && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 mb-6 text-sm text-accent">
                Demo mode &mdash; using simulated flight data. Connect an
                AviationStack API key for real flight lookups.
              </div>
            )}

            {/* Flight info card */}
            <div className="border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {result.flight.flightNumber}
                </h2>
                <span className="text-sm text-muted">
                  {result.flight.airline}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">From</p>
                  <p className="font-medium">{result.flight.departureAirport}</p>
                </div>
                <div>
                  <p className="text-muted">To</p>
                  <p className="font-medium">{result.flight.arrivalAirport}</p>
                </div>
                <div>
                  <p className="text-muted">Scheduled Arrival</p>
                  <p className="font-medium">
                    {new Date(result.flight.scheduledArrival).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Actual Arrival</p>
                  <p className="font-medium">
                    {result.flight.status === "cancelled"
                      ? "Cancelled"
                      : new Date(result.flight.actualArrival).toLocaleString()}
                  </p>
                </div>
              </div>

              {result.eligibility.delayMinutes > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted">Delay</p>
                  <p className="text-2xl font-bold text-danger">
                    {Math.floor(result.eligibility.delayMinutes / 60)}h{" "}
                    {result.eligibility.delayMinutes % 60}m
                  </p>
                </div>
              )}

              {result.flight.status === "cancelled" && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-danger">
                    Flight Cancelled
                  </p>
                </div>
              )}
            </div>

            {/* Eligibility result */}
            {result.eligibility.eligible ? (
              <div className="border-2 border-success rounded-lg p-6 bg-success/5">
                <div className="text-center">
                  <div className="text-4xl mb-2">&#10003;</div>
                  <h3 className="text-xl font-bold text-success">
                    You Could Be Owed{" "}
                    &euro;{result.eligibility.compensationEur}
                  </h3>
                  <p className="mt-2 text-muted">
                    {result.eligibility.reason}
                  </p>
                </div>

                <Link
                  href={`/claim?flight=${flightNumber}${date ? `&date=${date}` : ""}`}
                  className="mt-6 block w-full text-center h-12 leading-[3rem] rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                >
                  Start My Claim &rarr;
                </Link>

                <p className="mt-3 text-center text-sm text-muted">
                  No win, no fee. We only charge 25% if you get compensated.
                </p>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-6 bg-card">
                <div className="text-center">
                  <div className="text-4xl mb-2 text-muted">&#8212;</div>
                  <h3 className="text-xl font-bold text-foreground">
                    Not Eligible
                  </h3>
                  <p className="mt-2 text-muted">
                    {result.eligibility.reason}
                  </p>
                </div>

                <Link
                  href="/"
                  className="mt-6 block w-full text-center h-12 leading-[3rem] rounded-lg border border-border text-foreground font-medium hover:bg-card transition-colors"
                >
                  &larr; Check Another Flight
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
