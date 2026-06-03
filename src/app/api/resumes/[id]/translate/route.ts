import { NextResponse } from "next/server";
import { translateResumeField } from "@/lib/resume-store.mjs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  return NextResponse.json(translateResumeField(params.id, payload));
}
