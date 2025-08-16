import { NextResponse } from "next/server";
import axios from "axios";
import ical from "ical";
import * as cheerio from "cheerio";
import ICalEvent from "@/utils/interfaces/ICalEvent";

const API_CONFIG = {
  BASE_URL: "https://schema.mau.se/setup/jsp",
  CURRENT_PARAMS:
    "startDatum=idag&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&resurser=k.KD400C-20251-K3943-%2Cp.TGIDE25h1%2C",
  SELECTORS: {
    SIGNATURE_TABLE: "table.forklaringsTabell tr",
    TABLE_CELLS: "td",
  },
};

interface TeacherSignatures {
  [key: string]: string;
}

async function getTeacherSignatures(
  params: string
): Promise<TeacherSignatures> {
  try {
    const htmlResponse = await axios.get(
      `${API_CONFIG.BASE_URL}/SchemaGrafik.jsp?${params}&forklaringar=true`
    );

    const $ = cheerio.load(htmlResponse.data);
    const signatureRows = $(API_CONFIG.SELECTORS.SIGNATURE_TABLE).slice(1);
    const signatures: TeacherSignatures = {};

    signatureRows.each((_, row) => {
      const $row = $(row);
      const cells = $row
        .find(API_CONFIG.SELECTORS.TABLE_CELLS)
        .map((_, cell) => $(cell).text().trim())
        .get();

      if (cells.length >= 3) {
        const [signatureCode, firstName, lastName] = cells;
        if (signatureCode) {
          signatures[signatureCode] = `${firstName} ${lastName}`;
        }
      }
    });

    return signatures;
  } catch (error) {
    console.error("Error fetching teacher signatures:", error);
    return {};
  }
}

async function parseCalendarData(
  icalContent: string,
  params: string
): Promise<ICalEvent[] | { error: string }> {
  try {
    const parsedCalendar = ical.parseICS(icalContent);
    const teacherSignatures = await getTeacherSignatures(params);

    const events = Object.values(parsedCalendar)
      .filter((event) => event.type === "VEVENT")
      .map((event) => {
        const summary = event.summary ?? "";
        const start = event.start?.toISOString() ?? "";
        const end = event.end?.toISOString() ?? "";

        const programme = extractProgramme(summary);
        const course = extractCourse(summary);
        const signatureCode = extractSignature(summary);
        const topic = extractTopic(summary);
        const locations = event.location?.split(" ") ?? [];

        const teacherNames = signatureCode
          .split(" ")
          .map((code) => teacherSignatures[code])
          .filter(Boolean);

        return {
          summary,
          programme: programme.split(" "),
          course,
          signature: teacherNames,
          topic,
          start,
          end,
          locations,
        };
      });

    return events;
  } catch (error) {
    console.error("Error parsing calendar data:", error);
    return { error: "Failed to process calendar file" };
  }
}

const extractProgramme = (summary: string): string => {
  const match = summary.match(/Program:\s*([\w\d\s]+) Kurs/);
  return match ? match[1] : "";
};

const extractCourse = (summary: string): string => {
  const match = summary.match(/Kurs\.grp:\s*([\w\d\s:]+) Course/);
  return match ? match[1] : "";
};

const extractSignature = (summary: string): string => {
  const match = summary.match(/Sign:\s*([\w\s\d]+) Moment/);
  return match ? match[1] : "";
};

const extractTopic = (summary: string): string => {
  const match = summary.match(/Moment:\s*(.+) Aktivitetstyp/);
  return match ? match[1] : "";
};

export async function GET() {
  try {
    const icalUrl = `${API_CONFIG.BASE_URL}/SchemaICAL.ics?${API_CONFIG.CURRENT_PARAMS}`;
    const icalResponse = await axios.get(icalUrl);
    const events = await parseCalendarData(
      icalResponse.data,
      API_CONFIG.CURRENT_PARAMS
    );

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error in schedule API:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule data" },
      { status: 500 }
    );
  }
}
