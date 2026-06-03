import { NextResponse } from "next/server";
import { fitResumeLayout } from "@/lib/resume-store.mjs";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(fitResumeLayout(params.id));
}
