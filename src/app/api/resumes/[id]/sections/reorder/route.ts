import { NextResponse } from "next/server";
import { reorderResumeSection } from "@/lib/resume-store.mjs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  return NextResponse.json(reorderResumeSection(params.id, payload.sectionId, payload.direction, payload.targetSectionId));
}
