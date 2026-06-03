"use client";

import { getResumeLayoutSettings, getResumePages, getVisibleFieldOrder } from "@/lib/resume-core.mjs";
import type { CSSProperties } from "react";
import type { ResumeBlock, ResumeDocument, ResumeLanguage, ResumeSection } from "@/lib/resume-types";

type Fit = {
  targetPages: number;
  estimatedPages: number;
  compactLevel: number;
  exceedsTarget: boolean;
};

type ResumePage = {
  sections: ResumeSection[];
  contentLength: number;
};

export function ResumePreview({ fit, resume }: { fit: Fit; resume: ResumeDocument }) {
  const language = resume.language;
  const visibleSections = resume.sections.slice().sort((a, b) => a.order - b.order).filter((section) => section.visible);
  const pages: ResumePage[] = getResumePages(resume);
  const profile = visibleSections.find((section) => section.type === "profile");
  const profileBlock = profile?.content[0];
  const profileVisibleFields: string[] = profileBlock ? getVisibleFieldOrder(profileBlock) : [];
  const profileVisibleSet = new Set<string>(profileVisibleFields);
  const contactFields = profileVisibleFields.filter((field) => ["phone", "email", "city"].includes(field));
  const layout = getResumeLayoutSettings(resume);
  const pageStyle = {
    "--preview-margin": `${layout.pageMarginMm * 2.2}px`,
    "--preview-font-scale": layout.fontScale,
    "--preview-section-gap": `${layout.sectionGap}px`,
  } as CSSProperties;

  return (
    <aside className="preview-panel">
      <div className="preview-toolbar">
        <span>A4 Preview</span>
        <strong className={fit.exceedsTarget ? "danger" : "ok"}>
          {pages.length}/{fit.targetPages} 页
        </strong>
      </div>
      <div className="preview-pages">
        {pages.map((page, pageIndex) => (
          <article className={`resume-page compact-${fit.compactLevel} theme-${resume.themeId}`} key={pageIndex} style={pageStyle}>
            {pageIndex === 0 ? (
              <header className={`resume-header ${resume.photo ? "has-photo" : ""}`}>
                <div className="resume-header-main">
                  {profileVisibleSet.has("name") ? <h2>{profileBlock?.fields.name?.[language]}</h2> : null}
                  {profileVisibleSet.has("targetRole") ? <p>{profileBlock?.fields.targetRole?.[language]}</p> : null}
                  <div>
                    {contactFields.map((field) => (
                      <span key={field}>{profileBlock?.fields[field]?.[language]}</span>
                    ))}
                  </div>
                </div>
                {resume.photo ? <img alt="个人照片" className="resume-photo" src={resume.photo} /> : null}
              </header>
            ) : (
              <header className="resume-page-continuation">
                <span>{profileBlock?.fields.name?.[language]}</span>
                <span>Page {pageIndex + 1}</span>
              </header>
            )}
            {page.sections
              .filter((section) => section.type !== "profile")
              .map((section) => (
                <section className="resume-section" key={section.id}>
                  <h3>{section.title[language]}</h3>
                  {section.content.map((block) => renderBlock(section, block, language))}
                </section>
              ))}
            {page.sections.length === 0 ? <p className="empty-page-note">此页作为目标页数占位，可继续增加内容或放宽目标页数。</p> : null}
            <footer className="resume-footer">
              第 {pageIndex + 1} 页
            </footer>
          </article>
        ))}
      </div>
    </aside>
  );
}

function renderBlock(section: ResumeSection, block: ResumeBlock, language: ResumeLanguage) {
  if (section.type === "education") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return (
      <div className="resume-block" key={block.id}>
        <div className="resume-line">
          {visible.has("school") ? <strong>{block.fields.school?.[language]}</strong> : <strong />}
          <span>{dateRange(block, language, visible)}</span>
        </div>
        <div className="resume-line muted-line">
          <span>{joinValues([visible.has("degree") ? block.fields.degree?.[language] : "", visible.has("major") ? block.fields.major?.[language] : "", visible.has("location") ? block.fields.location?.[language] : ""])}</span>
          {visible.has("gpa") ? <span>{block.fields.gpa?.[language]}</span> : null}
        </div>
        {visible.has("courses") ? <p>{block.fields.courses?.[language]}</p> : null}
        {visible.has("honors") ? <p>{block.fields.honors?.[language]}</p> : null}
      </div>
    );
  }

  if (section.type === "experience") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return (
      <div className="resume-block" key={block.id}>
        <div className="resume-line">
          {visible.has("company") ? <strong>{block.fields.company?.[language]}</strong> : <strong />}
          <span>{dateRange(block, language, visible)}</span>
        </div>
        <div className="resume-line muted-line">
          <span>{joinValues([visible.has("position") ? block.fields.position?.[language] : "", visible.has("department") ? block.fields.department?.[language] : ""])}</span>
          {visible.has("location") ? <span>{block.fields.location?.[language]}</span> : null}
        </div>
        {visible.has("responsibilities") ? <p>{block.fields.responsibilities?.[language]}</p> : null}
        {visible.has("achievements") ? <p>{block.fields.achievements?.[language]}</p> : null}
      </div>
    );
  }

  if (section.type === "projects") {
    const visible = new Set<string>(getVisibleFieldOrder(block));
    return (
      <div className="resume-block" key={block.id}>
        <div className="resume-line">
          {visible.has("projectName") ? <strong>{block.fields.projectName?.[language]}</strong> : <strong />}
          <span>{dateRange(block, language, visible)}</span>
        </div>
        {visible.has("projectRole") ? <p className="muted-line">{block.fields.projectRole?.[language]}</p> : null}
        {visible.has("projectContext") ? <p>{block.fields.projectContext?.[language]}</p> : null}
        {visible.has("projectResult") ? <p>{block.fields.projectResult?.[language]}</p> : null}
      </div>
    );
  }

  return (
    <div className="resume-block" key={block.id}>
      {getVisibleFieldOrder(block).map((field: string) => (
        <p key={field}>{block.fields[field]?.[language]}</p>
      ))}
    </div>
  );
}

function dateRange(block: ResumeBlock, language: ResumeLanguage, visibleFields: Set<string>) {
  return joinValues([visibleFields.has("startDate") ? block.fields.startDate?.[language] : "", visibleFields.has("endDate") ? block.fields.endDate?.[language] : ""], " - ");
}

function joinValues(values: Array<string | undefined>, separator = " / ") {
  return values.filter(Boolean).join(separator);
}
