import { NextResponse } from "next/server";
import axios from "axios";
import ical from "ical";
import * as cheerio from "cheerio";
import ICalEvent from "@/utils/interfaces/ICalEvent";

// const PARAMS =
//   "startDatum=idag&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&resurser=k.KD400C-20251-K3943-%2Cp.TGIDE24h1%2C";

const PARAMS =
  "startDatum=idag&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&resurser=k.KD400C-20251-K3943-%2Cp.TGIDE25h1%2C";

async function getSignatures(params: string): Promise<{
  [key: string]: string;
}> {
  const htmlFile = (
    await axios.get(
      `https://schema.mau.se/setup/jsp/SchemaGrafik.jsp?${params}&forklaringar=true`
    )
  ).data;

  const $ = cheerio.load(htmlFile);

  const rows = $("table.forklaringsTabell tr").slice(1);

  const signatures: { [key: string]: string } = {};

  rows.each((_, row) => {
    const $row = $(row);
    const cells = $row
      .find("td")
      .map((_, cell) => $(cell).text().trim())
      .get();

    if (cells.length >= 3) {
      const [sign, firstName, lastName] = cells;
      if (sign) {
        signatures[sign] = `${firstName} ${lastName}`;
      }
    }
  });

  return signatures;
}

async function parseIcalData(
  icalFile: string,
  params: string
): Promise<ICalEvent[] | { error: string }> {
  try {
    const parsedData = ical.parseICS(icalFile);
    const signatures = await getSignatures(params);

    const events = Object.values(parsedData)
      .filter((event) => event.type === "VEVENT")
      .map((event) => {
        const summary = event.summary ?? "";
        const start = event.start?.toISOString() ?? "";
        const end = event.end?.toISOString() ?? "";

        const programmeMatch = summary.match(/Program:\s*([\w\d\s]+) Kurs/);
        const programme = programmeMatch ? programmeMatch[1] : "";

        const courseMatch = summary.match(/Kurs\.grp:\s*([\w\d\s:]+) Course/);
        const course = courseMatch ? courseMatch[1] : "";

        const signatureMatch = summary.match(/Sign:\s*([\w\s\d]+) Moment/);
        const signature = signatureMatch ? signatureMatch[1] : "";

        const locations = event.location?.split(" ") ?? [];

        const topicMatch = summary.match(/Moment:\s*(.+) Aktivitetstyp/);
        const topic = topicMatch ? topicMatch[1] : "";

        const signaturesNames = [];

        for (const sign of signature.split(" ")) {
          signaturesNames.push(signatures[sign]);
        }

        return {
          summary,
          programme: programme.split(" "),
          course,
          signature: signaturesNames,
          topic,
          start,
          end,
          locations,
        };
      });

    return events;
  } catch (error) {
    console.error("Error fetching or parsing iCal file:", error);
    return { error: "Failed to process iCal file" };
  }
}

export async function GET() {
  const icalUrl = `https://schema.mau.se/setup/jsp/SchemaICAL.ics?${PARAMS}`;
  const icalFile = (await axios.get(icalUrl)).data;

  const events = await parseIcalData(icalFile, PARAMS);

  return NextResponse.json({ events });
}
