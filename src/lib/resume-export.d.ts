import type { ResumeDocument } from "./resume-types";

export function renderResumePrintHtml(resume: ResumeDocument): string;
export function renderResumePagedHtml(resume: ResumeDocument): string;
export function buildResumeWordDocument(resume: ResumeDocument): {
  content: string;
  extension: "doc";
  mimeType: "application/msword;charset=utf-8";
};
