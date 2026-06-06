import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_RESUME_LAYOUT_SETTINGS,
  applyMachineTranslation,
  calculateLayoutFit,
  createDefaultResume,
  formatYearMonth,
  getResumeLayoutSettings,
  hideBlockField,
  getResumePages,
  moveBlock,
  moveSection,
  moveBlockField,
  reorderSectionBefore,
  restoreRecommendedOrder,
  translateResumeToLanguage,
  translateFieldValue,
  updateTranslatedField,
} from "../src/lib/resume-core.mjs";
import { buildResumeWordDocument, renderResumePrintHtml } from "../src/lib/resume-export.mjs";

test("creates a finance resume with the recommended section order", () => {
  const resume = createDefaultResume();

  assert.equal(resume.language, "zh");
  assert.equal(resume.targetPages, 1);
  assert.equal(resume.photo, "");
  assert.deepEqual(resume.layout, DEFAULT_RESUME_LAYOUT_SETTINGS);
  assert.deepEqual(
    resume.sections.map((section) => section.type),
    DEFAULT_SECTION_ORDER,
  );
  assert.ok(resume.sections.some((section) => section.type === "selfEvaluation"));
  assert.ok(!resume.sections.some((section) => section.type === "certifications"));
  assert.equal(resume.themeId, "finance-classic");
});

test("normalizes resume layout settings for preview and PDF export", () => {
  const resume = createDefaultResume({
    layout: {
      pageMarginMm: 40,
      fontScale: "bad",
      sectionGap: 2,
    },
  });

  assert.deepEqual(getResumeLayoutSettings(resume), {
    pageMarginMm: 24,
    fontScale: DEFAULT_RESUME_LAYOUT_SETTINGS.fontScale,
    sectionGap: 6,
  });
});

test("education and experience sections use structured fillable fields", () => {
  const resume = createDefaultResume();
  const education = resume.sections.find((section) => section.type === "education");
  const experience = resume.sections.find((section) => section.type === "experience");

  assert.deepEqual(Object.keys(education.content[0].fields), [
    "school",
    "degree",
    "major",
    "startDate",
    "endDate",
    "location",
    "gpa",
    "courses",
    "honors",
  ]);
  assert.deepEqual(Object.keys(experience.content[0].fields), [
    "company",
    "startDate",
    "endDate",
    "position",
    "department",
    "location",
    "responsibilities",
    "achievements",
  ]);
  assert.deepEqual(education.content[0].fieldOrder, Object.keys(education.content[0].fields));
  assert.deepEqual(experience.content[0].hiddenFields, []);
});

test("moves and hides fields inside a section block", () => {
  const resume = createDefaultResume();

  const moved = moveBlockField(resume, "selfEvaluation", "self-evaluation-main", "strengths", "up");
  const evaluationBlock = moved.sections.find((section) => section.type === "selfEvaluation").content[0];
  assert.equal(evaluationBlock.fieldOrder[0], "strengths");

  const hidden = hideBlockField(moved, "selfEvaluation", "self-evaluation-main", "evaluation");
  const hiddenBlock = hidden.sections.find((section) => section.type === "selfEvaluation").content[0];
  assert.ok(hiddenBlock.hiddenFields.includes("evaluation"));
});

test("moves repeatable blocks inside a section", () => {
  const resume = createDefaultResume();
  const education = resume.sections.find((section) => section.type === "education");
  const secondEducation = {
    ...education.content[0],
    id: "education-second",
    fields: {
      ...education.content[0].fields,
      school: { zh: "xx学院", en: "XX College" },
    },
  };
  const withSecondEducation = {
    ...resume,
    sections: resume.sections.map((section) =>
      section.type === "education" ? { ...section, content: [...section.content, secondEducation] } : section,
    ),
  };

  const moved = moveBlock(withSecondEducation, "education", "education-second", "up");
  const movedEducation = moved.sections.find((section) => section.type === "education");

  assert.equal(movedEducation.content[0].id, "education-second");
  assert.equal(movedEducation.content[1].id, "education-main");
});

test("moves sections up and down without changing hidden state", () => {
  const resume = createDefaultResume();
  const hiddenExperience = {
    ...resume.sections.find((section) => section.type === "experience"),
    visible: false,
  };
  const withHiddenExperience = {
    ...resume,
    sections: resume.sections.map((section) =>
      section.type === "experience" ? hiddenExperience : section,
    ),
  };

  const moved = moveSection(withHiddenExperience, "experience", "up");

  assert.deepEqual(
    moved.sections.map((section) => section.type),
    ["profile", "selfEvaluation", "experience", "education", "projects", "skills", "awards", "languages"],
  );
  assert.equal(
    moved.sections.find((section) => section.type === "experience").visible,
    false,
  );
});

test("restores recommended order while preserving section visibility", () => {
  const resume = createDefaultResume();
  const moved = moveSection(moveSection(resume, "languages", "up"), "languages", "up");
  const withHiddenAwards = {
    ...moved,
    sections: moved.sections.map((section) =>
      section.type === "awards" ? { ...section, visible: false } : section,
    ),
  };

  const restored = restoreRecommendedOrder(withHiddenAwards);

  assert.deepEqual(
    restored.sections.map((section) => section.type),
    DEFAULT_SECTION_ORDER,
  );
  assert.equal(restored.sections.find((section) => section.type === "awards").visible, false);
});

test("reorders a dragged section before a target section", () => {
  const resume = createDefaultResume();

  const reordered = reorderSectionBefore(resume, "languages", "education");

  assert.deepEqual(
    reordered.sections.map((section) => section.type),
    ["profile", "selfEvaluation", "languages", "education", "experience", "projects", "skills", "awards"],
  );
});

test("calculates one-page overflow and gives compression advice without deleting content", () => {
  const resume = createDefaultResume({
    targetPages: 1,
    sections: [
      {
        type: "experience",
        content: "负责多行业公司估值、财务建模、尽职调查，覆盖消费、TMT 与新能源行业，输出超过三十页研究底稿。".repeat(20),
      },
    ],
  });

  const fit = calculateLayoutFit(resume);

  assert.equal(fit.targetPages, 1);
  assert.equal(fit.exceedsTarget, true);
  assert.equal(fit.contentWasDeleted, false);
  assert.ok(fit.suggestions.some((item) => item.includes("缩短经历描述")));
});

test("splits visible content into preview pages using the target page count", () => {
  const resume = createDefaultResume({
    targetPages: 2,
    sections: [
      {
        type: "experience",
        content: "参与 DCF 估值、财务建模与尽调，覆盖 12 家上市公司，输出研究底稿并支持投资建议。".repeat(28),
      },
    ],
  });

  const pages = getResumePages(resume);

  assert.equal(pages.length, 2);
  assert.ok(pages[0].sections.length > 0);
  assert.ok(pages[1].sections.length > 0);
});

test("auto page mode expands page count based on content length", () => {
  const resume = createDefaultResume({
    targetPages: "auto",
    sections: [
      {
        type: "experience",
        content: "参与 DCF 估值、财务建模与尽调，覆盖 12 家上市公司，输出研究底稿并支持投资建议。".repeat(45),
      },
    ],
  });

  const fit = calculateLayoutFit(resume);
  const pages = getResumePages(resume);

  assert.ok(fit.targetPages > 1);
  assert.equal(pages.length, fit.targetPages);
  assert.equal(fit.exceedsTarget, false);
});

test("translates field values instead of echoing an existing stale value", () => {
  const translated = translateFieldValue("xx大学", "school", "en");

  assert.equal(translated, "XX University");
  assert.notEqual(translated, "Translated: xx大学");
});

test("translates the whole resume to English without mutating the original language", () => {
  const resume = createDefaultResume();

  const english = translateResumeToLanguage(resume, "en");

  assert.equal(resume.language, "zh");
  assert.equal(english.language, "en");
  assert.equal(
    english.sections.find((section) => section.type === "education").content[0].fields.school.en,
    "XX University",
  );
  assert.equal(
    english.sections.find((section) => section.type === "skills").content[0].fields.certifications.en,
    "CFA Level I Candidate, Securities Qualification Certificate",
  );
});

test("exports English from the latest Chinese edits instead of stale default English", () => {
  const resume = createDefaultResume();
  const edited = {
    ...resume,
    sections: resume.sections.map((section) =>
      section.type === "education"
        ? {
            ...section,
            content: section.content.map((block) => ({
              ...block,
              fields: {
                ...block.fields,
                school: {
                  ...block.fields.school,
                  zh: "xx学院",
                  en: "XX University",
                },
              },
            })),
          }
        : section,
    ),
  };

  const english = translateResumeToLanguage(edited, "en");

  assert.equal(
    english.sections.find((section) => section.type === "education").content[0].fields.school.en,
    "XX College",
  );
});

test("formats year and month values consistently", () => {
  assert.equal(formatYearMonth(2018, 9), "2018.09");
  assert.equal(formatYearMonth("2026", "6"), "2026.06");
});

test("applies machine translation and marks edited fields as reviewed", () => {
  const resume = createDefaultResume();
  const translated = applyMachineTranslation(resume, {
    sectionId: "profile",
    blockId: "profile-main",
    field: "summary",
    language: "en",
    text: "Finance analyst candidate with valuation and due diligence experience.",
  });

  assert.equal(
    translated.sections[0].content[0].fields.summary.en,
    "Finance analyst candidate with valuation and due diligence experience.",
  );
  assert.equal(translated.sections[0].content[0].translationStatus, "machine");

  const reviewed = updateTranslatedField(translated, {
    sectionId: "profile",
    blockId: "profile-main",
    field: "summary",
    language: "en",
    text: "Finance analyst candidate focused on valuation, research, and due diligence.",
  });

  assert.equal(reviewed.sections[0].content[0].translationStatus, "reviewed");
});

test("renders export HTML and Word document content from resume fields", () => {
  const resume = createDefaultResume();

  const html = renderResumePrintHtml(resume);
  const word = buildResumeWordDocument(resume);

  assert.match(html, /<!doctype html>/);
  assert.match(html, /@page \{ size: A4/);
  assert.match(html, /金融分析师/);
  assert.match(word.content, /xmlns:o="urn:schemas-microsoft-com:office:office"/);
  assert.match(word.content, /金融分析师/);
  assert.equal(word.mimeType, "application/msword;charset=utf-8");
  assert.equal(word.extension, "doc");
});
