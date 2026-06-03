import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(
    {
      error: "DIAGNOSIS_REMOVED",
      message: "简历诊断模块已移除，请使用页数与排版建议。",
      resumeId: params.id,
    },
    { status: 410 },
  );
}
