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
