import { NextResponse } from "next/server";
import { createResume } from "@/lib/resume-store.mjs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(createResume(payload), { status: 201 });
}
