import { getResumeLayoutSettings, getResumePages, getVisibleFieldOrder } from "./resume-core.mjs";

export function renderResumePrintHtml(resume) {
  return renderResumeHtml(resume, { paged: false });
}

export function renderResumePagedHtml(resume) {
  return renderResumeHtml(resume, { paged: true });
}

export function buildResumeWordDocument(resume) {
  const body = renderResumePrintHtml(resume)
    .replace("<!doctype html>", "")
    .replace("<html", '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"');

  return {
    content: `\ufeff${body}`,
    extension: "doc",
    mimeType: "application/msword;charset=utf-8",
  };
}

function renderResumeHtml(resume, options) {
  const language = resume.language;
  const layout = getResumeLayoutSettings(resume);
  const sections = resume.sections.slice().sort((a, b) => a.order - b.order).filter((section) => section.visible);
  const pages = options.paged ? getResumePages(resume) : [{ sections }];
  const profile = sections.find((section) => section.type === "profile");
  const profileBlock = profile?.content[0];
  const profileFields = new Set(profileBlock ? getVisibleFieldOrder(profileBlock) : []);

  return `<!doctype html>
<html lang="${language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(resume.title || "resume")}</title>
  <style>
    @page { size: A4; margin: ${options.paged ? "0" : `${layout.pageMarginMm}mm`}; }
    * { box-sizing: border-box; }
    body { color: #172026; font-family: ${themeFontFamily(resume.themeId)}; margin: 0; }
    .page { ${options.paged ? `height: 297mm; overflow: hidden; padding: ${layout.pageMarginMm}mm; page-break-after: always; width: 210mm;` : ""} }
    .page:last-child { page-break-after: auto; }
    .page-content { ${options.paged ? "--fit-scale: 1; transform: scale(var(--fit-scale)); transform-origin: left top; width: calc(100% / var(--fit-scale));" : ""} }
    header { align-items: flex-start; border-bottom: 2px solid #172026; display: flex; justify-content: space-between; gap: 18px; padding-bottom: 8px; }
    .photo { border: 1px solid #d8dee3; height: 28mm; object-fit: cover; width: 22mm; }
    h1 { font-size: ${25 * layout.fontScale}px; margin: 0 0 4px; }
    h2 { border-bottom: 1px solid #d8dee3; font-size: ${14 * layout.fontScale}px; margin: ${layout.sectionGap}px 0 6px; padding-bottom: 3px; }
    p { font-size: ${11 * layout.fontScale}px; line-height: 1.45; margin: 2px 0; }
    .role { color: #0f766e; font-weight: 700; }
    .contact { color: #69757d; display: flex; flex-wrap: wrap; gap: 12px; font-size: ${11 * layout.fontScale}px; }
    .summary { margin-top: 8px; }
    .line { align-items: baseline; display: flex; justify-content: space-between; gap: 12px; }
    .line strong, .line span { font-size: ${11 * layout.fontScale}px; }
    .muted { color: #69757d; }
    .block { break-inside: avoid; margin-bottom: 8px; }
    .continuation { color: #69757d; font-size: 11px; justify-content: space-between; }
  </style>
</head>
<body>
  ${pages.map((page, pageIndex) => renderPage(resume, page, pageIndex, language, profileBlock, profileFields, options)).join("")}
</body>
</html>`;
}

function renderPage(resume, page, pageIndex, language, profileBlock, profileFields, options) {
  return `<main class="page theme-${escapeHtml(resume.themeId ?? "finance-classic")}"><div class="page-content">
    ${pageIndex === 0 ? renderHeader(resume, language, profileBlock, profileFields) : renderContinuationHeader(profileBlock, language, pageIndex)}
    ${page.sections.filter((section) => section.type !== "profile").map((section) => renderSectionHtml(section, language)).join("")}
  </div></main>${options.paged ? "" : ""}`;
}

function renderHeader(resume, language, profileBlock, profileFields) {
  return `<header>
    <div>
      ${profileFields.has("name") ? `<h1>${field(profileBlock, "name", language)}</h1>` : ""}
      ${profileFields.has("targetRole") ? `<p class="role">${field(profileBlock, "targetRole", language)}</p>` : ""}
      <div class="contact">
        ${profileFields.has("phone") ? `<span>${field(profileBlock, "phone", language)}</span>` : ""}
        ${profileFields.has("email") ? `<span>${field(profileBlock, "email", language)}</span>` : ""}
        ${profileFields.has("city") ? `<span>${field(profileBlock, "city", language)}</span>` : ""}
      </div>
    </div>
    ${resume.photo ? `<img alt="" class="photo" src="${escapeHtml(resume.photo)}" />` : ""}
  </header>`;
}

function renderContinuationHeader(profileBlock, language, pageIndex) {
  return `<header class="continuation"><span>${field(profileBlock, "name", language)}</span><span>Page ${pageIndex + 1}</span></header>`;
}

function renderSectionHtml(section, language) {
  return `<section><h2>${escapeHtml(section.title[language])}</h2>${section.content.map((block) => renderBlockHtml(section.type, block, language)).join("")}</section>`;
}

function renderBlockHtml(type, block, language) {
  const visible = new Set(getVisibleFieldOrder(block));
  if (type === "education") {
    return `<div class="block">
      <div class="line"><strong>${visible.has("school") ? field(block, "school", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      <div class="line muted"><span>${join([visible.has("degree") ? field(block, "degree", language) : "", visible.has("major") ? field(block, "major", language) : "", visible.has("location") ? field(block, "location", language) : ""])}</span><span>${visible.has("gpa") ? field(block, "gpa", language) : ""}</span></div>
      ${visible.has("courses") ? `<p>${field(block, "courses", language)}</p>` : ""}${visible.has("honors") ? `<p>${field(block, "honors", language)}</p>` : ""}
    </div>`;
  }
  if (type === "experience") {
    return `<div class="block">
      <div class="line"><strong>${visible.has("company") ? field(block, "company", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      <div class="line muted"><span>${join([visible.has("position") ? field(block, "position", language) : "", visible.has("department") ? field(block, "department", language) : ""])}</span><span>${visible.has("location") ? field(block, "location", language) : ""}</span></div>
      ${visible.has("responsibilities") ? `<p>${field(block, "responsibilities", language)}</p>` : ""}${visible.has("achievements") ? `<p>${field(block, "achievements", language)}</p>` : ""}
    </div>`;
  }
  if (type === "projects") {
    return `<div class="block">
      <div class="line"><strong>${visible.has("projectName") ? field(block, "projectName", language) : ""}</strong><span>${dateRange(block, language, visible)}</span></div>
      ${visible.has("projectRole") ? `<p class="muted">${field(block, "projectRole", language)}</p>` : ""}${visible.has("projectContext") ? `<p>${field(block, "projectContext", language)}</p>` : ""}${visible.has("projectResult") ? `<p>${field(block, "projectResult", language)}</p>` : ""}
    </div>`;
  }
  return `<div class="block">${getVisibleFieldOrder(block).map((fieldName) => `<p>${field(block, fieldName, language)}</p>`).join("")}</div>`;
}

function field(block, key, language) {
  return escapeHtml(block?.fields[key]?.[language] ?? "");
}

function dateRange(block, language, visible) {
  return join([visible.has("startDate") ? field(block, "startDate", language) : "", visible.has("endDate") ? field(block, "endDate", language) : ""], " - ");
}

function join(values, separator = " / ") {
  return values.filter(Boolean).join(separator);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function themeFontFamily(themeId) {
  if (themeId === "editorial-serif") return 'Georgia, "Times New Roman", SimSun, serif';
  if (themeId === "modern-sans") return 'Inter, Arial, "Microsoft YaHei", sans-serif';
  return 'Arial, "Microsoft YaHei", sans-serif';
}
