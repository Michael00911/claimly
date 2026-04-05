import { NextRequest } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ClaimRequest {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDate: string;
  delayMinutes: number;
  compensationEur: number;
  status: string;
  passengerName: string;
  passengerEmail: string;
  passengerAddress: string;
  bookingReference?: string;
}

function generateClaimLetterFallback(data: ClaimRequest): string {
  const delayHours = Math.floor(data.delayMinutes / 60);
  const delayMins = data.delayMinutes % 60;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${data.passengerName}
${data.passengerAddress}
${data.passengerEmail}

${today}

${data.airline}
Customer Relations Department

Subject: Compensation Claim Under EU Regulation EC261/2004 — Flight ${data.flightNumber}

Dear Sir/Madam,

I am writing to claim compensation under EU Regulation EC261/2004 for flight ${data.flightNumber} from ${data.departureAirport} to ${data.arrivalAirport}, scheduled for ${data.scheduledDate}.

${
  data.status === "cancelled"
    ? `This flight was cancelled, causing significant disruption to my travel plans.`
    : `This flight arrived at its destination with a delay of ${delayHours} hours${delayMins > 0 ? ` and ${delayMins} minutes` : ""}, significantly exceeding the 3-hour threshold established by the European Court of Justice in the Sturgeon v. Condor ruling (C-402/07).`
}

Under EU Regulation EC261/2004, I am entitled to compensation of €${data.compensationEur} for this disruption.${data.bookingReference ? ` My booking reference is ${data.bookingReference}.` : ""}

I kindly request that you process this compensation within 14 days of receipt of this letter. Payment should be made via bank transfer or cheque to the address above.

Should you fail to respond or refuse this claim without valid justification, I reserve the right to escalate this matter to the relevant National Enforcement Body and/or pursue the claim through the courts.

I look forward to your prompt response.

Yours faithfully,
${data.passengerName}`;
}

async function generateClaimLetterWithAI(
  data: ClaimRequest
): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  const prompt = `Generate a professional, formal compensation claim letter under EU Regulation EC261/2004 with these details:

- Passenger: ${data.passengerName}
- Address: ${data.passengerAddress}
- Email: ${data.passengerEmail}
- Airline: ${data.airline}
- Flight: ${data.flightNumber}
- Route: ${data.departureAirport} → ${data.arrivalAirport}
- Date: ${data.scheduledDate}
- Issue: ${data.status === "cancelled" ? "Flight cancelled" : `Arrived ${Math.floor(data.delayMinutes / 60)}h ${data.delayMinutes % 60}m late`}
- Compensation amount: €${data.compensationEur}
${data.bookingReference ? `- Booking reference: ${data.bookingReference}` : ""}

Requirements:
- Cite EC261/2004 and relevant case law (Sturgeon v. Condor C-402/07)
- Be firm but professional
- Request payment within 14 days
- Mention escalation to National Enforcement Body if no response
- Include the passenger's contact details at the top
- Date the letter today
- Do NOT include any placeholder text — use the real data provided`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;

  const result = await res.json();
  const text = result?.content?.[0]?.text;
  return text || null;
}

export async function POST(request: NextRequest) {
  let body: ClaimRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.passengerName || !body.passengerEmail || !body.flightNumber) {
    return Response.json(
      { error: "Missing required fields: passengerName, passengerEmail, flightNumber" },
      { status: 400 }
    );
  }

  // Try AI generation, fallback to template
  let letter = await generateClaimLetterWithAI(body);
  const isAI = !!letter;
  if (!letter) {
    letter = generateClaimLetterFallback(body);
  }

  return Response.json({ letter, isAI });
}
