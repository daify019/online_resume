import { NextResponse } from "next/server";
import { getResume, updateResume } from "@/lib/resume-store.mjs";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(getResume(params.id));
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  return NextResponse.json(updateResume(params.id, payload));
}
