import { NextRequest } from "next/server";
import { checkEC261Eligibility, type FlightInfo } from "@/lib/ec261";

// AviationStack API (free tier: 100 req/month)
// For MVP we use a mock fallback when no API key is configured
const AVIATIONSTACK_KEY = process.env.AVIATIONSTACK_API_KEY;

interface AviationStackFlight {
  flight: { iata: string };
  airline: { name: string };
  departure: {
    airport: string;
    iata: string;
    timezone: string;
    scheduled: string;
    actual: string | null;
    country?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    timezone: string;
    scheduled: string;
    actual: string | null;
    country?: string;
  };
  flight_status: string;
}

async function fetchFlightFromAPI(
  flightNumber: string,
  date?: string
): Promise<FlightInfo | null> {
  if (!AVIATIONSTACK_KEY) return null;

  const params = new URLSearchParams({
    access_key: AVIATIONSTACK_KEY,
    flight_iata: flightNumber,
  });
  if (date) params.set("flight_date", date);

  const res = await fetch(
    `http://api.aviationstack.com/v1/flights?${params.toString()}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  const flight = data?.data?.[0] as AviationStackFlight | undefined;
  if (!flight) return null;

  // Estimate distance based on flight data (rough calculation)
  // In production, use a proper airport database
  const distanceKm = estimateDistance(
    flight.departure.iata,
    flight.arrival.iata
  );

  return {
    flightNumber: flight.flight.iata,
    airline: flight.airline.name,
    departureAirport: `${flight.departure.airport} (${flight.departure.iata})`,
    departureCountry: flight.departure.country || getCountryFromIata(flight.departure.iata),
    arrivalAirport: `${flight.arrival.airport} (${flight.arrival.iata})`,
    arrivalCountry: flight.arrival.country || getCountryFromIata(flight.arrival.iata),
    scheduledDeparture: flight.departure.scheduled,
    actualDeparture: flight.departure.actual || flight.departure.scheduled,
    scheduledArrival: flight.arrival.scheduled,
    actualArrival: flight.arrival.actual || flight.arrival.scheduled,
    distanceKm,
    status: mapStatus(flight.flight_status),
  };
}

function mapStatus(
  status: string
): "landed" | "cancelled" | "diverted" | "delayed" | "on_time" {
  switch (status?.toLowerCase()) {
    case "cancelled":
      return "cancelled";
    case "diverted":
      return "diverted";
    case "active":
    case "landed":
      return "landed";
    default:
      return "on_time";
  }
}

// MVP: demo data for testing without API key
function getMockFlight(flightNumber: string, date?: string): FlightInfo {
  const fn = flightNumber.toUpperCase();
  const flightDate = date || new Date().toISOString().split("T")[0];

  // Simulate different scenarios based on flight number patterns
  if (fn.startsWith("LH") || fn.startsWith("BA") || fn.startsWith("AF")) {
    // EU departure, delayed flight
    return {
      flightNumber: fn,
      airline: fn.startsWith("LH")
        ? "Lufthansa"
        : fn.startsWith("BA")
          ? "British Airways"
          : "Air France",
      departureAirport: fn.startsWith("LH")
        ? "Frankfurt Airport (FRA)"
        : fn.startsWith("BA")
          ? "London Heathrow (LHR)"
          : "Paris Charles de Gaulle (CDG)",
      departureCountry: fn.startsWith("LH")
        ? "DE"
        : fn.startsWith("BA")
          ? "GB"
          : "FR",
      arrivalAirport: "Barcelona El Prat (BCN)",
      arrivalCountry: "ES",
      scheduledDeparture: `${flightDate}T10:00:00Z`,
      actualDeparture: `${flightDate}T14:30:00Z`,
      scheduledArrival: `${flightDate}T12:30:00Z`,
      actualArrival: `${flightDate}T17:00:00Z`,
      distanceKm: 1100,
      status: "landed",
    };
  }

  if (fn.startsWith("FR") || fn.startsWith("U2")) {
    // Cancelled flight
    return {
      flightNumber: fn,
      airline: fn.startsWith("FR") ? "Ryanair" : "easyJet",
      departureAirport: "Dublin Airport (DUB)",
      departureCountry: "IE",
      arrivalAirport: "Rome Fiumicino (FCO)",
      arrivalCountry: "IT",
      scheduledDeparture: `${flightDate}T08:00:00Z`,
      actualDeparture: `${flightDate}T08:00:00Z`,
      scheduledArrival: `${flightDate}T11:30:00Z`,
      actualArrival: `${flightDate}T11:30:00Z`,
      distanceKm: 1900,
      status: "cancelled",
    };
  }

  // Default: non-EU flight, on time
  return {
    flightNumber: fn,
    airline: "Unknown Airline",
    departureAirport: "New York JFK (JFK)",
    departureCountry: "US",
    arrivalAirport: "Los Angeles (LAX)",
    arrivalCountry: "US",
    scheduledDeparture: `${flightDate}T09:00:00Z`,
    actualDeparture: `${flightDate}T09:15:00Z`,
    scheduledArrival: `${flightDate}T12:00:00Z`,
    actualArrival: `${flightDate}T12:10:00Z`,
    distanceKm: 3980,
    status: "landed",
  };
}

// Rough distance estimates for common airport pairs (MVP)
function estimateDistance(dep: string, arr: string): number {
  const distances: Record<string, number> = {
    "FRA-BCN": 1100,
    "LHR-BCN": 1150,
    "CDG-BCN": 850,
    "DUB-FCO": 1900,
    "FRA-JFK": 6200,
    "LHR-JFK": 5500,
    "CDG-JFK": 5800,
  };
  const key = `${dep}-${arr}`;
  const reverseKey = `${arr}-${dep}`;
  return distances[key] || distances[reverseKey] || 2000;
}

// Simplified country lookup from IATA code (MVP)
function getCountryFromIata(iata: string): string {
  const mapping: Record<string, string> = {
    FRA: "DE", MUC: "DE", TXL: "DE", BER: "DE",
    LHR: "GB", LGW: "GB", STN: "GB", MAN: "GB",
    CDG: "FR", ORY: "FR", NCE: "FR", LYS: "FR",
    BCN: "ES", MAD: "ES", PMI: "ES", AGP: "ES",
    FCO: "IT", MXP: "IT", VCE: "IT", NAP: "IT",
    AMS: "NL", BRU: "BE", VIE: "AT", ZRH: "CH",
    DUB: "IE", CPH: "DK", OSL: "NO", ARN: "SE",
    HEL: "FI", WAW: "PL", PRG: "CZ", BUD: "HU",
    ATH: "GR", LIS: "PT", OTP: "RO", SOF: "BG",
    JFK: "US", LAX: "US", ORD: "US", SFO: "US",
    PEK: "CN", PVG: "CN", NRT: "JP", HND: "JP",
    ICN: "KR", SIN: "SG", HKG: "HK", BKK: "TH",
    DXB: "AE", DOH: "QA", IST: "TR",
  };
  return mapping[iata] || "XX";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const flightNumber = searchParams.get("flight");
  const date = searchParams.get("date") || undefined;

  if (!flightNumber) {
    return Response.json(
      { error: "Flight number is required" },
      { status: 400 }
    );
  }

  // Clean flight number
  const cleanFlight = flightNumber.replace(/\s+/g, "").toUpperCase();

  // Try real API first, fallback to mock
  let flightInfo = await fetchFlightFromAPI(cleanFlight, date);
  const isDemo = !flightInfo;
  if (!flightInfo) {
    flightInfo = getMockFlight(cleanFlight, date);
  }

  const eligibility = checkEC261Eligibility(flightInfo);

  return Response.json({
    flight: flightInfo,
    eligibility,
    isDemo,
  });
}
