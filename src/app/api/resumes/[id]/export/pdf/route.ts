import { NextResponse } from "next/server";
import { getResumeLayoutSettings, getResumePages, getVisibleFieldOrder } from "@/lib/resume-core.mjs";
import { getResume } from "@/lib/resume-store.mjs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json().catch(() => null);
  const resume = payload?.resume ?? getResume(params.id);
  const html = renderResumeHtml(resume);

  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.setContent(html, { waitUntil: "networkidle" });
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
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    await browser.close();

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.id}-${resume.language}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "PDF_EXPORT_UNAVAILABLE",
        message: "Playwright is not installed or its browser runtime is unavailable. Install dependencies and run `npx playwright install chromium` to enable PDF export.",
      },
      { status: 503 },
    );
  }
}

function renderResumeHtml(resume: any) {
  const language = resume.language;
  const sections = resume.sections.slice().sort((a: any, b: any) => a.order - b.order).filter((section: any) => section.visible);
  const pages = getResumePages(resume);
  const layout = getResumeLayoutSettings(resume);
  const profile = sections.find((section: any) => section.type === "profile");
  const profileBlock = profile?.content[0];
  const profileFields = new Set(profileBlock ? getVisibleFieldOrder(profileBlock) : []);

  return `<!doctype html>
<html lang="${language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 0; }
    body { margin: 0; font-family: ${themeFontFamily(resume.themeId)}; color: #172026; }
    .page { box-sizing: border-box; height: 297mm; overflow: hidden; padding: ${layout.pageMarginMm}mm; page-break-after: always; width: 210mm; }
    .page:last-child { page-break-after: auto; }
    .page-content { --fit-scale: 1; transform: scale(var(--fit-scale)); transform-origin: left top; width: calc(100% / var(--fit-scale)); }
    header { align-items: flex-start; border-bottom: 2px solid #172026; display: flex; justify-content: space-between; gap: 18px; padding-bottom: 8px; }
    .photo { border: 1px solid #d8dee3; height: 28mm; object-fit: cover; width: 22mm; }
    h1 { font-size: ${25 * layout.fontScale}px; margin: 0 0 4px; }
    h2 { border-bottom: 1px solid #d8dee3; font-size: ${14 * layout.fontScale}px; margin: ${layout.sectionGap}px 0 6px; padding-bottom: 3px; }
    p { font-size: ${11 * layout.fontScale}px; line-height: 1.45; margin: 2px 0; }
    .role { color: #0f766e; font-weight: 700; }
    .contact { color: #69757d; display: flex; gap: 12px; font-size: ${11 * layout.fontScale}px; }
    .summary { margin-top: 8px; }
    .line { align-items: baseline; display: flex; justify-content: space-between; gap: 12px; }
    .line strong, .line span { font-size: ${11 * layout.fontScale}px; }
    .muted { color: #69757d; }
    .block { margin-bottom: 8px; }
    .continuation { color: #69757d; font-size: 11px; justify-content: space-between; }
  </style>
</head>
<body>
  ${pages.map((page: any, pageIndex: number) => `<main class="page theme-${escapeHtml(resume.themeId ?? "finance-classic")}"><div class="page-content">
    ${pageIndex === 0 ? `<header>
      <div>
        ${profileFields.has("name") ? `<h1>${escapeHtml(profileBlock?.fields.name?.[language] ?? "")}</h1>` : ""}
        ${profileFields.has("targetRole") ? `<p class="role">${escapeHtml(profileBlock?.fields.targetRole?.[language] ?? "")}</p>` : ""}
        <div class="contact">
          ${profileFields.has("phone") ? `<span>${escapeHtml(profileBlock?.fields.phone?.[language] ?? "")}</span>` : ""}
          ${profileFields.has("email") ? `<span>${escapeHtml(profileBlock?.fields.email?.[language] ?? "")}</span>` : ""}
          ${profileFields.has("city") ? `<span>${escapeHtml(profileBlock?.fields.city?.[language] ?? "")}</span>` : ""}
        </div>
      </div>
      ${resume.photo ? `<img alt="" class="photo" src="${escapeHtml(resume.photo)}" />` : ""}
    </header>` : `<header class="continuation"><span>${escapeHtml(profileBlock?.fields.name?.[language] ?? "")}</span><span>Page ${pageIndex + 1}</span></header>`}
    ${page.sections.filter((section: any) => section.type !== "profile").map((section: any) => renderSectionHtml(section, language)).join("")}
  </div>
  </main>`).join("")}
</body>
</html>`;
}

function renderSectionHtml(section: any, language: string) {
  return `<section><h2>${escapeHtml(section.title[language])}</h2>${section.content.map((block: any) => renderBlockHtml(section.type, block, language)).join("")}</section>`;
}

function renderBlockHtml(type: string, block: any, language: string) {
  if (type === "education") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return `<div class="block">
      <div class="line"><strong>${visible.has("school") ? field(block, "school", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      <div class="line muted"><span>${join([visible.has("degree") ? field(block, "degree", language) : "", visible.has("major") ? field(block, "major", language) : "", visible.has("location") ? field(block, "location", language) : ""])}</span><span>${visible.has("gpa") ? field(block, "gpa", language) : ""}</span></div>
      ${visible.has("courses") ? `<p>${field(block, "courses", language)}</p>` : ""}${visible.has("honors") ? `<p>${field(block, "honors", language)}</p>` : ""}
    </div>`;
  }
  if (type === "experience") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return `<div class="block">
      <div class="line"><strong>${visible.has("company") ? field(block, "company", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      <div class="line muted"><span>${join([visible.has("position") ? field(block, "position", language) : "", visible.has("department") ? field(block, "department", language) : ""])}</span><span>${visible.has("location") ? field(block, "location", language) : ""}</span></div>
      ${visible.has("responsibilities") ? `<p>${field(block, "responsibilities", language)}</p>` : ""}${visible.has("achievements") ? `<p>${field(block, "achievements", language)}</p>` : ""}
    </div>`;
  }
  if (type === "projects") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return `<div class="block">
      <div class="line"><strong>${visible.has("projectName") ? field(block, "projectName", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      ${visible.has("projectRole") ? `<p class="muted">${field(block, "projectRole", language)}</p>` : ""}${visible.has("projectContext") ? `<p>${field(block, "projectContext", language)}</p>` : ""}${visible.has("projectResult") ? `<p>${field(block, "projectResult", language)}</p>` : ""}
    </div>`;
  }
  return `<div class="block">${getVisibleFieldOrder(block).map((fieldName: string) => `<p>${field(block, fieldName, language)}</p>`).join("")}</div>`;
}

function field(block: any, key: string, language: string) {
  return escapeHtml(block.fields[key]?.[language] ?? "");
}

function dateRange(block: any, language: string, visible: Set<string>) {
  return join([visible.has("startDate") ? field(block, "startDate", language) : "", visible.has("endDate") ? field(block, "endDate", language) : ""], " - ");
}

function join(values: string[], separator = " / ") {
  return values.filter(Boolean).join(separator);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function themeFontFamily(themeId: string) {
  if (themeId === "editorial-serif") return 'Georgia, "Times New Roman", SimSun, serif';
  if (themeId === "modern-sans") return 'Inter, Arial, "Microsoft YaHei", sans-serif';
  return 'Arial, "Microsoft YaHei", sans-serif';
}
