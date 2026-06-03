export type ResumeLanguage = "zh" | "en";
export type TargetPages = 1 | 2 | "auto";
export type TargetIndustry =
  | "investment_banking"
  | "securities"
  | "fund"
  | "risk"
  | "audit"
  | "consulting"
  | "other";

export type TranslationStatus = "empty" | "machine" | "reviewed";

export type ResumeLayoutSettings = {
  pageMarginMm: number;
  fontScale: number;
  sectionGap: number;
};

export type ResumeBlock = {
  id: string;
  fields: Record<string, Record<ResumeLanguage, string>>;
  fieldOrder: string[];
  hiddenFields: string[];
  translationStatus: TranslationStatus;
};

export type ResumeSection = {
  id: string;
  type:
    | "profile"
    | "selfEvaluation"
    | "education"
    | "experience"
    | "projects"
    | "skills"
    | "awards"
    | "languages"
    | "custom";
  title: Record<ResumeLanguage, string>;
  order: number;
  visible: boolean;
  content: ResumeBlock[];
};

export type ResumeVersion = {
  id: string;
  label: string;
  createdAt: string;
};

export type ResumeDocument = {
  id: string;
  title: string;
  targetRole: string;
  targetIndustry: TargetIndustry;
  language: ResumeLanguage;
  targetPages: TargetPages;
  themeId: string;
  layout: ResumeLayoutSettings;
  photo: string;
  sections: ResumeSection[];
  versions: ResumeVersion[];
};

export const LANGUAGES: ResumeLanguage[];
export const DEFAULT_SECTION_ORDER: ResumeSection["type"][];
export const SECTION_TITLES: Record<ResumeSection["type"], Record<ResumeLanguage, string>>;
export const FIELD_META: Record<string, { zh: string; en: string; kind: "short" | "long" }>;
export const RESUME_THEMES: Array<{ id: string; name: string; fontFamily: string }>;
export const DEFAULT_RESUME_LAYOUT_SETTINGS: ResumeLayoutSettings;
export function createDefaultResume(overrides?: Partial<ResumeDocument> & { sections?: { type: string; content: string }[] }): ResumeDocument;
export function moveSection(resume: ResumeDocument, sectionId: string, direction: "up" | "down"): ResumeDocument;
export function reorderSectionBefore(resume: ResumeDocument, draggedSectionId: string, targetSectionId: string): ResumeDocument;
export function restoreRecommendedOrder(resume: ResumeDocument): ResumeDocument;
export function moveBlock(resume: ResumeDocument, sectionId: string, blockId: string, direction: "up" | "down"): ResumeDocument;
export function moveBlockField(resume: ResumeDocument, sectionId: string, blockId: string, field: string, direction: "up" | "down"): ResumeDocument;
export function hideBlockField(resume: ResumeDocument, sectionId: string, blockId: string, field: string): ResumeDocument;
export function showBlockField(resume: ResumeDocument, sectionId: string, blockId: string, field: string): ResumeDocument;
export function translateFieldValue(text: string, field: string, targetLanguage: ResumeLanguage): string;
export function translateResumeToLanguage(resume: ResumeDocument, language: ResumeLanguage): ResumeDocument;
export function formatYearMonth(year: string | number, month: string | number): string;
export function getVisibleFieldOrder(block: ResumeBlock): string[];
export function getResumePages(resume: ResumeDocument): Array<{ sections: ResumeSection[]; contentLength: number }>;
export function getResumeLayoutSettings(resume: ResumeDocument): ResumeLayoutSettings;
export function applyMachineTranslation(
  resume: ResumeDocument,
  patch: { sectionId: string; blockId: string; field: string; language: ResumeLanguage; text: string },
): ResumeDocument;
export function updateTranslatedField(
  resume: ResumeDocument,
  patch: { sectionId: string; blockId: string; field: string; language: ResumeLanguage; text: string },
): ResumeDocument;
export function calculateLayoutFit(resume: ResumeDocument): {
  targetPages: number;
  estimatedPages: number;
  compactLevel: number;
  pageCapacity: number;
  contentLength: number;
  exceedsTarget: boolean;
  contentWasDeleted: boolean;
  suggestions: string[];
};
export function getResumePlainText(resume: ResumeDocument, language?: ResumeLanguage): string;
