import { NextResponse } from "next/server";
import { renderResumePagedHtml } from "@/lib/resume-export.mjs";
import { getResume } from "@/lib/resume-store.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;

const chromiumPackUrl = "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json().catch(() => null);
  const resume = payload?.resume ?? getResume(params.id);
  const html = renderResumePagedHtml(resume);

  try {
    const pdf = process.env.VERCEL ? await renderPdfWithServerlessPlaywright(html) : await renderPdfWithPlaywright(html);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.id}-${resume.language}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export failed", error);
    return NextResponse.json(
      {
        error: "PDF_EXPORT_UNAVAILABLE",
        message: "PDF export could not start a browser runtime. Please try again later.",
      },
      { status: 503 },
    );
  }
}

async function renderPdfWithServerlessPlaywright(html: string) {
  const [{ default: puppeteer }, chromiumRuntime] = await Promise.all([
    import("puppeteer-core"),
    import("@sparticuz/chromium-min"),
  ]);
  const browser = await puppeteer.launch({
    args: chromiumRuntime.default.args,
    defaultViewport: { width: 794, height: 1123 },
    executablePath: await chromiumRuntime.default.executablePath(chromiumPackUrl),
    headless: chromiumRuntime.default.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await applyPageFit(page);
    return page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close().catch(() => undefined);
  }
}

async function renderPdfWithPlaywright(html: string) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.setContent(html, { waitUntil: "networkidle" });
    await applyPageFit(page);
    return page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close().catch(() => undefined);
  }
}

async function applyPageFit(page: { evaluate: (callback: () => void) => Promise<unknown> }) {
  await page.evaluate(() => {
    for (const content of Array.from(document.querySelectorAll<HTMLElement>(".page-content"))) {
      const pageElement = content.closest<HTMLElement>(".page");
      if (!pageElement) continue;
      const availableHeight = pageElement.clientHeight;
      const contentHeight = content.scrollHeight;
      if (!contentHeight) continue;
      const fitScale = Math.min(1.18, Math.max(0.82, availableHeight / contentHeight));
      content.style.setProperty("--fit-scale", fitScale.toFixed(3));
    }
  });
}
