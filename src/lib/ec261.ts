// EU/EEA member state airport country codes
const EU_EEA_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA
  "IS", "LI", "NO",
  // Switzerland (separate agreement)
  "CH",
  // UK (retained EC261 as UK261 post-Brexit)
  "GB",
]);

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  departureCountry: string;
  arrivalAirport: string;
  arrivalCountry: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  distanceKm: number;
  status: "landed" | "cancelled" | "diverted" | "delayed" | "on_time";
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  compensationEur: number;
  delayMinutes: number;
  regulation: string;
}

export function checkEC261Eligibility(flight: FlightInfo): EligibilityResult {
  const departureIsEU = EU_EEA_COUNTRIES.has(flight.departureCountry);
  const arrivalIsEU = EU_EEA_COUNTRIES.has(flight.arrivalCountry);

  // EC261 applies if:
  // 1. Flight departs from EU/EEA airport (any airline), OR
  // 2. Flight arrives at EU/EEA airport AND operated by EU-based airline
  // For MVP, we check departure from EU (simplest and most common case)
  const isEUFlight = departureIsEU || arrivalIsEU;

  if (!isEUFlight) {
    return {
      eligible: false,
      reason:
        "This flight does not depart from or arrive at an EU/EEA airport. EC261 regulation only applies to flights connected to EU/EEA airports.",
      compensationEur: 0,
      delayMinutes: 0,
      regulation: "EC261/2004",
    };
  }

  // Calculate arrival delay in minutes
  const scheduled = new Date(flight.scheduledArrival).getTime();
  const actual = new Date(flight.actualArrival).getTime();
  const delayMinutes = Math.round((actual - scheduled) / 60000);

  if (flight.status === "cancelled") {
    const compensation = getCompensationByDistance(flight.distanceKm);
    return {
      eligible: true,
      reason:
        "Your flight was cancelled. Under EC261, you are entitled to compensation unless the airline informed you at least 14 days before departure.",
      compensationEur: compensation,
      delayMinutes: 0,
      regulation: "EC261/2004",
    };
  }

  if (delayMinutes < 180) {
    return {
      eligible: false,
      reason: `Your flight arrived ${delayMinutes > 0 ? delayMinutes + " minutes late" : "on time"}. EC261 compensation requires a delay of at least 3 hours on arrival.`,
      compensationEur: 0,
      delayMinutes: Math.max(0, delayMinutes),
      regulation: "EC261/2004",
    };
  }

  const compensation = getCompensationByDistance(flight.distanceKm);

  return {
    eligible: true,
    reason: `Your flight arrived ${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m late. Under EU Regulation EC261/2004, you are entitled to compensation.`,
    compensationEur: compensation,
    delayMinutes,
    regulation: "EC261/2004",
  };
}

function getCompensationByDistance(distanceKm: number): number {
  if (distanceKm <= 1500) return 250;
  if (distanceKm <= 3500) return 400;
  return 600;
}

export function formatCompensation(amount: number): string {
  return `€${amount}`;
}
