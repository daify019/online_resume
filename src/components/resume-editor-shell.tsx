"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  calculateLayoutFit,
  getResumeLayoutSettings,
  hideBlockField,
  moveBlock,
  moveSection,
  moveBlockField,
  reorderSectionBefore,
  RESUME_THEMES,
  restoreRecommendedOrder,
  showBlockField,
  translateResumeToLanguage,
  updateTranslatedField,
} from "@/lib/resume-core.mjs";
import { buildResumeWordDocument, renderResumePrintHtml } from "@/lib/resume-export.mjs";
import type { ResumeDocument, ResumeSection, TargetPages } from "@/lib/resume-types";
import { FitAdvisor } from "./resume-fit-advisor";
import { ResumePreview } from "./resume-preview";
import { SectionFormPanel } from "./section-form-panel";
import { SectionManager } from "./section-manager";

const storageKey = "finance-resume-builder:resume";

export function ResumeEditorShell({ initialResume }: { initialResume: ResumeDocument }) {
  const [resume, setResume] = useState(initialResume);
  const [activeSectionId, setActiveSectionId] = useState(initialResume.sections[0].id);
  const [savedAt, setSavedAt] = useState("刚刚");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "working">("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const activeSection = resume.sections.find((section) => section.id === activeSectionId) ?? resume.sections[0];
  const fit = useMemo(() => calculateLayoutFit(resume), [resume]);
  const layout = getResumeLayoutSettings(resume);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as ResumeDocument;
      setResume(parsed);
      setActiveSectionId(parsed.sections[0]?.id ?? initialResume.sections[0].id);
      setSavedAt("本地草稿");
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [initialResume.sections]);

  function updateResume(next: ResumeDocument) {
    setResume(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
  }

  function updateTargetPages(targetPages: TargetPages) {
    updateResume({ ...resume, targetPages });
  }

  function updateLayoutSetting(key: keyof typeof layout, value: number) {
    updateResume({
      ...resume,
      layout: {
        ...layout,
        [key]: value,
      },
    });
  }

  function updateSection(nextSection: ResumeSection) {
    updateResume({
      ...resume,
      sections: resume.sections.map((section) => (section.id === nextSection.id ? nextSection : section)),
    });
  }

  function addBlock(sectionId: string) {
    const section = resume.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const template = section.content[0];
    const emptyBlock = {
      id: `${section.type}-${Date.now()}`,
      translationStatus: "empty" as const,
      fields: Object.fromEntries(Object.keys(template.fields).map((field) => [field, { zh: "", en: "" }])),
      fieldOrder: template.fieldOrder ?? Object.keys(template.fields),
      hiddenFields: [],
    };
    updateSection({ ...section, content: [...section.content, emptyBlock] });
  }

  function removeBlock(sectionId: string, blockId: string) {
    const section = resume.sections.find((item) => item.id === sectionId);
    if (!section || section.content.length <= 1) return;
    updateSection({ ...section, content: section.content.filter((block) => block.id !== blockId) });
  }

  function moveEntry(sectionId: string, blockId: string, direction: "up" | "down") {
    updateResume(moveBlock(resume, sectionId, blockId, direction));
  }

  function toggleSection(sectionId: string) {
    updateResume({
      ...resume,
      sections: resume.sections.map((section) => (section.id === sectionId ? { ...section, visible: !section.visible } : section)),
    });
  }

  function move(sectionId: string, direction: "up" | "down") {
    updateResume(moveSection(resume, sectionId, direction));
  }

  function restoreOrder() {
    updateResume(restoreRecommendedOrder(resume));
  }

  function reorderBefore(sectionId: string, targetSectionId: string) {
    updateResume(reorderSectionBefore(resume, sectionId, targetSectionId));
  }

  function moveField(sectionId: string, blockId: string, field: string, direction: "up" | "down") {
    updateResume(moveBlockField(resume, sectionId, blockId, field, direction));
  }

  function hideField(sectionId: string, blockId: string, field: string) {
    updateResume(hideBlockField(resume, sectionId, blockId, field));
  }

  function showField(sectionId: string, blockId: string, field: string) {
    updateResume(showBlockField(resume, sectionId, blockId, field));
  }

  async function exportPdf() {
    await exportResumePdf(resume);
  }

  async function exportEnglishPdf() {
    await exportResumePdf(translateResumeToLanguage(resume, "en"));
  }

  function exportWord() {
    const word = buildResumeWordDocument(resume);
    downloadTextFile(word.content, `${resume.title}-${resume.language}.${word.extension}`, word.mimeType);
  }

  function exportData() {
    downloadTextFile(JSON.stringify(resume, null, 2), `${resume.title || "resume"}.json`, "application/json");
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as ResumeDocument;
      if (!Array.isArray(parsed.sections)) throw new Error("缺少 sections");
      updateResume(parsed);
      setActiveSectionId(parsed.sections[0]?.id ?? activeSectionId);
    } catch {
      window.alert("导入失败，请选择由本编辑器导出的 JSON 文件。");
    }
  }

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("请上传图片文件。");
      return;
    }
    const photo = await readFileAsDataUrl(file);
    updateResume({ ...resume, photo });
  }

  function removePhoto() {
    updateResume({ ...resume, photo: "" });
  }

  async function exportResumePdf(resumeForExport: ResumeDocument) {
    if (window.location.hostname.endsWith(".vercel.app")) {
      printResumePdfFallback(resumeForExport);
      return;
    }

    setExportState("working");
    try {
      const response = await fetch(`/api/resumes/${resumeForExport.id}/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeForExport }),
      });
      if (!response.ok) {
        printResumePdfFallback(resumeForExport);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeForExport.title}-${resumeForExport.language}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      printResumePdfFallback(resumeForExport);
    } finally {
      setExportState("idle");
    }
  }

  return (
    <main className={`editor-shell app-theme-${resume.themeId}`}>
      <header className="topbar">
        <div>
          <p className="eyebrow">Finance Resume Studio</p>
          <h1>金融求职简历制作器</h1>
        </div>
        <div className="top-actions">
          <button className="ghost-button" disabled={exportState === "working"} onClick={exportEnglishPdf}>
            一键导出英文简历
          </button>
          <button className="ghost-button" onClick={exportData}>
            导出数据
          </button>
          <button className="ghost-button" onClick={exportWord}>
            导出 Word
          </button>
          <button className="ghost-button" onClick={() => fileInputRef.current?.click()}>
            导入数据
          </button>
          <input ref={fileInputRef} accept="application/json" className="sr-only" onChange={importData} type="file" />
          <button className="ghost-button" onClick={() => photoInputRef.current?.click()}>
            上传照片
          </button>
          <input ref={photoInputRef} accept="image/*" className="sr-only" onChange={uploadPhoto} type="file" />
          {resume.photo ? (
            <button className="ghost-button" onClick={removePhoto}>
              移除照片
            </button>
          ) : null}
          <button className="primary-button" disabled={exportState === "working"} onClick={exportPdf}>
            {exportState === "working" ? "导出中" : "导出 PDF"}
          </button>
        </div>
      </header>

      <section className="control-strip">
        <label>
          目标页数
          <select value={resume.targetPages} onChange={(event) => updateTargetPages(parseTargetPages(event.target.value))}>
            <option value="1">1 页</option>
            <option value="2">2 页</option>
            <option value="auto">自动</option>
          </select>
        </label>
        <label>
          页面设计
          <select value={resume.themeId} onChange={(event) => updateResume({ ...resume, themeId: event.target.value })}>
            {RESUME_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
        <div className="layout-control">
          <button className={layoutOpen ? "primary-button" : "ghost-button"} onClick={() => setLayoutOpen((open) => !open)}>
            版式参数
          </button>
          {layoutOpen ? (
            <div className="layout-popover">
              <label>
                <span>页边距 {layout.pageMarginMm} mm</span>
                <input
                  max="24"
                  min="8"
                  onChange={(event) => updateLayoutSetting("pageMarginMm", Number(event.target.value))}
                  type="range"
                  value={layout.pageMarginMm}
                />
              </label>
              <label>
                <span>字号比例 {Math.round(layout.fontScale * 100)}%</span>
                <input
                  max="1.18"
                  min="0.9"
                  onChange={(event) => updateLayoutSetting("fontScale", Number(event.target.value))}
                  step="0.01"
                  type="range"
                  value={layout.fontScale}
                />
              </label>
              <label>
                <span>段落间距 {layout.sectionGap}px</span>
                <input
                  max="20"
                  min="6"
                  onChange={(event) => updateLayoutSetting("sectionGap", Number(event.target.value))}
                  type="range"
                  value={layout.sectionGap}
                />
              </label>
            </div>
          ) : null}
        </div>
        <span className="save-state">已保存 {savedAt}</span>
        <button className={previewOpen ? "primary-button" : "ghost-button"} onClick={() => setPreviewOpen((open) => !open)}>
          {previewOpen ? "收起预览" : "预览简历"}
        </button>
        <div className="mobile-tabs">
          <button className={view === "edit" ? "active" : ""} onClick={() => setView("edit")}>
            编辑
          </button>
          <button className={view === "preview" ? "active" : ""} onClick={() => setView("preview")}>
            预览
          </button>
        </div>
      </section>

      <div className={`workspace view-${view} ${previewOpen ? "preview-open" : "preview-closed"}`}>
        <SectionManager
          activeSectionId={activeSection.id}
          language={resume.language}
          sections={resume.sections}
          onActivate={setActiveSectionId}
          onMove={move}
          onReorderBefore={reorderBefore}
          onRestore={restoreOrder}
          onToggle={toggleSection}
        />
        <section className="editor-panel">
          <SectionFormPanel
            language={resume.language}
            section={activeSection}
            onAddBlock={addBlock}
            onChange={updateSection}
            onHideField={hideField}
            onMoveBlock={moveEntry}
            onMoveField={moveField}
            onRemoveBlock={removeBlock}
            onShowField={showField}
            onReviewField={(patch) => updateResume(updateTranslatedField(resume, patch))}
          />
          <FitAdvisor fit={fit} />
        </section>
        {previewOpen ? <ResumePreview fit={fit} resume={resume} /> : null}
      </div>
    </main>
  );
}

function parseTargetPages(value: string): TargetPages {
  if (value === "auto") return "auto";
  return value === "2" ? 2 : 1;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function downloadTextFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printResumePdfFallback(resume: ResumeDocument) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.border = "0";
  iframe.style.height = "1px";
  iframe.style.left = "-9999px";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.width = "1px";
  iframe.srcdoc = renderResumePrintHtml(resume);
  document.body.append(iframe);
  iframe.addEventListener("load", () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 150);
  });
  setTimeout(() => iframe.remove(), 60000);
}
