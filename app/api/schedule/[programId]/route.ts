import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import ical from "ical";
import * as cheerio from "cheerio";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import { getProgramById } from "@/utils/constants/Programs";

const API_CONFIG = {
  BASE_URL: "https://schema.mau.se/setup/jsp/",
  BASE_PARAMS:
    "?startDatum=today&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&sprak=EN&resurser=p.",
  SELECTORS: {
    SIGNATURE_TABLE: "table.forklaringsTabell tr",
    TABLE_CELLS: "td",
  },
};

interface TeacherSignatures {
  [key: string]: string;
}

async function getTeacherSignatures(
  programId: string
): Promise<TeacherSignatures> {
  try {
    // https://schema.mau.se/setup/jsp/SchemaGrafik.jsp?startDatum=today&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&sprak=EN&resurser=p.TAINE25h%2C
    const htmlResponse = await axios.get(
      `${API_CONFIG.BASE_URL}SchemaGrafik.jsp${API_CONFIG.BASE_PARAMS}${programId}%2C`
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
  programId: string
): Promise<ICalEvent[] | { error: string }> {
  try {
    const parsedCalendar = ical.parseICS(icalContent);
    const teacherSignatures = await getTeacherSignatures(programId);

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const program = getProgramById(programId);

    console.log(programId);

    if (!program) {
      return NextResponse.json(
        { error: `Program with ID '${programId}' not found` },
        { status: 404 }
      );
    }

    // https://schema.mau.se/setup/jsp/SchemaICAL.ics?startDatum=today&intervallTyp=a&intervallAntal=1&forklaringar=true&sokMedAND=false&sprak=EN&resurser=p.TAINE25h%2C
    const icalUrl = `${API_CONFIG.BASE_URL}SchemaICAL.ics${API_CONFIG.BASE_PARAMS}${programId}%2C`;
    const icalResponse = await axios.get(icalUrl);
    const events = await parseCalendarData(icalResponse.data, programId);

    return NextResponse.json({ events, program: program.name });
  } catch (error) {
    console.error("Error in schedule API:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule data" },
      { status: 500 }
    );
  }
}
