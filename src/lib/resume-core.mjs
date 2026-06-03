export const LANGUAGES = ["zh", "en"];

export const RESUME_THEMES = [
  {
    id: "finance-classic",
    name: "经典金融",
    fontFamily: "Arial, Microsoft YaHei, sans-serif",
  },
  {
    id: "modern-sans",
    name: "现代清爽",
    fontFamily: "Inter, Arial, Microsoft YaHei, sans-serif",
  },
  {
    id: "editorial-serif",
    name: "稳重衬线",
    fontFamily: "Georgia, Times New Roman, SimSun, serif",
  },
];

export const DEFAULT_RESUME_LAYOUT_SETTINGS = {
  pageMarginMm: 14,
  fontScale: 1.08,
  sectionGap: 12,
};

export const DEFAULT_SECTION_ORDER = [
  "profile",
  "selfEvaluation",
  "education",
  "experience",
  "projects",
  "skills",
  "awards",
  "languages",
];

export const SECTION_TITLES = {
  profile: { zh: "基本信息", en: "Contact" },
  selfEvaluation: { zh: "自我评价", en: "About" },
  education: { zh: "教育背景", en: "Education" },
  experience: { zh: "实习/工作经历", en: "Experience" },
  projects: { zh: "项目/交易/研究经历", en: "Projects" },
  skills: { zh: "技能、工具与证书", en: "Skills, Tools & Certifications" },
  awards: { zh: "获奖经历", en: "Honors & Awards" },
  languages: { zh: "语言能力", en: "Languages" },
};

export const FIELD_META = {
  name: { zh: "姓名", en: "Name", kind: "short" },
  targetRole: { zh: "目标岗位", en: "Target Role", kind: "short" },
  phone: { zh: "电话", en: "Phone", kind: "short" },
  email: { zh: "邮箱", en: "Email", kind: "short" },
  city: { zh: "所在城市", en: "City", kind: "short" },
  evaluation: { zh: "自我评价", en: "About", kind: "long" },
  strengths: { zh: "核心优势", en: "Core Strengths", kind: "long" },
  school: { zh: "学校", en: "School", kind: "short" },
  degree: { zh: "学历", en: "Degree", kind: "short" },
  major: { zh: "专业", en: "Major", kind: "short" },
  startDate: { zh: "开始时间", en: "Start Date", kind: "short" },
  endDate: { zh: "结束时间", en: "End Date", kind: "short" },
  location: { zh: "地点", en: "Location", kind: "short" },
  gpa: { zh: "GPA/排名", en: "GPA/Rank", kind: "short" },
  courses: { zh: "核心课程", en: "Relevant Coursework", kind: "long" },
  honors: { zh: "荣誉/奖学金", en: "Honors", kind: "long" },
  company: { zh: "工作单位", en: "Company", kind: "short" },
  position: { zh: "职位", en: "Position", kind: "short" },
  department: { zh: "部门/团队", en: "Department", kind: "short" },
  responsibilities: { zh: "工作内容", en: "Responsibilities", kind: "long" },
  achievements: { zh: "成果/量化贡献", en: "Achievements", kind: "long" },
  projectName: { zh: "项目名称", en: "Project Name", kind: "short" },
  projectRole: { zh: "项目角色", en: "Role", kind: "short" },
  projectContext: { zh: "项目背景", en: "Context", kind: "long" },
  projectResult: { zh: "项目结果", en: "Result", kind: "long" },
  financeSkills: { zh: "金融能力", en: "Finance Skills", kind: "long" },
  tools: { zh: "工具/软件", en: "Tools", kind: "long" },
  programming: { zh: "编程/数据能力", en: "Programming & Data", kind: "long" },
  certifications: { zh: "证书/资格", en: "Certifications", kind: "long" },
  awards: { zh: "奖项", en: "Awards", kind: "long" },
  languages: { zh: "语言", en: "Languages", kind: "long" },
};

const TRANSLATION_DICTIONARY = new Map([
  ["林予安", "Yuan Lin"],
  ["张金融", "Zhang Jinrong"],
  ["金融分析师", "Financial Analyst"],
  ["投行实习生", "Investment Banking Intern"],
  ["上海财经大学", "Shanghai University of Finance and Economics"],
  ["复旦大学", "Fudan University"],
  ["金融硕士", "Master of Finance"],
  ["金融学", "Finance"],
  ["上海", "Shanghai"],
  ["北京", "Beijing"],
  ["华东证券研究所", "Huadong Securities Research Institute"],
  ["行研实习生", "Equity Research Intern"],
  ["研究部", "Research Department"],
  ["新能源研究组", "New Energy Research Team"],
  ["消费行业并购案例研究", "Consumer M&A Case Study"],
  ["项目负责人", "Project Lead"],
  ["校级一等奖学金", "First-class University Scholarship"],
  ["证券从业资格", "Securities Qualification Certificate"],
  ["英语 CET-6", "CET-6 English"],
  ["公司金融", "Corporate Finance"],
  ["投资学", "Investments"],
  ["财务报表分析", "Financial Statement Analysis"],
  ["估值", "valuation"],
  ["财务建模", "financial modeling"],
  ["尽调", "due diligence"],
  ["风险控制", "risk control"],
  ["交易金额", "transaction value"],
]);

const REVERSE_TRANSLATION_DICTIONARY = new Map(
  [...TRANSLATION_DICTIONARY.entries()].map(([zh, en]) => [en.toLowerCase(), zh]),
);

const DEFAULT_BLOCKS = {
  profile: [
    block("profile-main", {
      name: ["林予安", "Yuan Lin"],
      targetRole: ["金融分析师 / 投行实习生", "Financial Analyst / Investment Banking Intern"],
      phone: ["138-0000-0000", "+86 138-0000-0000"],
      email: ["yuan.lin@example.com", "yuan.lin@example.com"],
      city: ["上海", "Shanghai"],
    }),
  ],
  selfEvaluation: [
    block("self-evaluation-main", {
      evaluation: [
        "金融硕士候选人，具备估值、财务建模、行业研究和尽职调查经验，关注消费、TMT 与新能源方向。",
        "Finance master's candidate with experience in valuation, financial modeling, industry research, and due diligence.",
      ],
      strengths: [
        "擅长把公开资料、财务数据和行业逻辑整理成可执行结论，能够独立完成模型搭建与报告底稿。",
        "Able to translate public information, financial data, and sector logic into actionable conclusions; independently builds models and research drafts.",
      ],
    }),
  ],
  education: [
    block("education-main", {
      school: ["上海财经大学", "Shanghai University of Finance and Economics"],
      degree: ["金融硕士", "Master of Finance"],
      major: ["金融学", "Finance"],
      startDate: ["2024.09", "Sep 2024"],
      endDate: ["2026.06", "Jun 2026"],
      location: ["上海", "Shanghai"],
      gpa: ["GPA 3.8/4.0，专业前 10%", "GPA 3.8/4.0, top 10%"],
      courses: ["公司金融、投资学、财务报表分析、金融工程", "Corporate Finance, Investments, Financial Statement Analysis, Financial Engineering"],
      honors: ["校级一等奖学金；全国大学生金融建模竞赛二等奖", "First-class University Scholarship; National Financial Modeling Competition Second Prize"],
    }),
  ],
  experience: [
    block("experience-main", {
      company: ["华东证券研究所", "Huadong Securities Research Institute"],
      startDate: ["2025.06", "Jun 2025"],
      endDate: ["2025.09", "Sep 2025"],
      position: ["行研实习生", "Equity Research Intern"],
      department: ["新能源研究组", "New Energy Research Team"],
      location: ["上海", "Shanghai"],
      responsibilities: [
        "整理 Wind、公告和电话会纪要，跟踪新能源产业链公司财务数据与行业景气度。",
        "Compiled Wind data, company filings, and earnings call notes to track financials and sector trends across the new-energy value chain.",
      ],
      achievements: [
        "参与 12 家上市公司财务拆解，搭建三表模型并输出估值敏感性分析，支持周报和深度报告底稿。",
        "Analyzed 12 listed companies, built three-statement models, and prepared valuation sensitivity analysis for weekly and in-depth research drafts.",
      ],
    }),
  ],
  projects: [
    block("projects-main", {
      projectName: ["消费行业并购案例研究", "Consumer M&A Case Study"],
      startDate: ["2025.03", "Mar 2025"],
      endDate: ["2025.05", "May 2025"],
      projectRole: ["项目负责人", "Project Lead"],
      projectContext: [
        "围绕消费行业标的公司，梳理商业模式、盈利质量和可比公司估值区间。",
        "Studied a consumer-sector target by reviewing its business model, earnings quality, and valuation range of comparable companies.",
      ],
      projectResult: [
        "基于 DCF、可比公司和可比交易法评估标的价值，测算 30 亿元交易规模下的协同效应。",
        "Valued the target with DCF, trading comps, and transaction comps; estimated synergies under a RMB 3bn deal scenario.",
      ],
    }),
  ],
  skills: [
    block("skills-main", {
      financeSkills: ["DCF、可比公司估值、财务建模、尽职调查、行业研究", "DCF, trading comps, financial modeling, due diligence, industry research"],
      tools: ["Wind、Bloomberg、Excel VBA", "Wind, Bloomberg, Excel VBA"],
      programming: ["Python、SQL、数据清洗与可视化", "Python, SQL, data cleaning and visualization"],
      certifications: ["CFA Level I Candidate、证券从业资格", "CFA Level I Candidate, Securities Qualification Certificate"],
    }),
  ],
  awards: [
    block("awards-main", {
      awards: ["校级一等奖学金、全国大学生金融建模竞赛二等奖", "First-class University Scholarship, National Financial Modeling Competition Second Prize"],
    }),
  ],
  languages: [
    block("languages-main", {
      languages: ["英语 CET-6，具备英文研报阅读与双语简历表达能力", "CET-6 English; able to read English research reports and prepare bilingual resumes"],
    }),
  ],
};

export function createDefaultResume(overrides = {}) {
  const sections = DEFAULT_SECTION_ORDER.map((type, index) => ({
    id: type,
    type,
    title: SECTION_TITLES[type],
    order: index,
    visible: true,
    content: clone(DEFAULT_BLOCKS[type]),
  }));

  const resume = {
    id: "resume-finance-demo",
    title: "金融分析师中文简历",
    targetRole: "金融分析师",
    targetIndustry: "investment_banking",
    language: "zh",
    targetPages: 1,
    themeId: "finance-classic",
    layout: DEFAULT_RESUME_LAYOUT_SETTINGS,
    photo: "",
    sections,
    versions: [{ id: "v1", label: "初始版本", createdAt: "2026-06-02T00:00:00.000Z" }],
  };

  return applyResumeOverrides(resume, overrides);
}

export function moveSection(resume, sectionId, direction) {
  const sorted = sortSections(resume.sections);
  const index = sorted.findIndex((section) => section.id === sectionId || section.type === sectionId);
  if (index === -1) return resume;
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return resume;
  const nextSections = sorted.slice();
  [nextSections[index], nextSections[targetIndex]] = [nextSections[targetIndex], nextSections[index]];
  return { ...resume, sections: normalizeOrder(nextSections) };
}

export function reorderSectionBefore(resume, draggedSectionId, targetSectionId) {
  if (draggedSectionId === targetSectionId) return resume;
  const sorted = sortSections(resume.sections);
  const dragged = sorted.find((section) => section.id === draggedSectionId || section.type === draggedSectionId);
  if (!dragged) return resume;
  const withoutDragged = sorted.filter((section) => section.id !== dragged.id);
  const targetIndex = withoutDragged.findIndex((section) => section.id === targetSectionId || section.type === targetSectionId);
  if (targetIndex === -1) return resume;
  const nextSections = withoutDragged.slice();
  nextSections.splice(targetIndex, 0, dragged);
  return { ...resume, sections: normalizeOrder(nextSections) };
}

export function restoreRecommendedOrder(resume) {
  const byType = new Map(resume.sections.map((section) => [section.type, section]));
  const ordered = DEFAULT_SECTION_ORDER.map((type, index) => ({ ...byType.get(type), order: index }));
  return { ...resume, sections: ordered };
}

export function moveBlock(resume, sectionId, blockId, direction) {
  return {
    ...resume,
    sections: resume.sections.map((section) => {
      if (section.id !== sectionId && section.type !== sectionId) return section;
      const index = section.content.findIndex((block) => block.id === blockId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || targetIndex < 0 || targetIndex >= section.content.length) return section;
      const nextContent = section.content.slice();
      [nextContent[index], nextContent[targetIndex]] = [nextContent[targetIndex], nextContent[index]];
      return { ...section, content: nextContent };
    }),
  };
}

export function moveBlockField(resume, sectionId, blockId, field, direction) {
  return updateBlock(resume, sectionId, blockId, (block) => {
    const order = getFieldOrder(block);
    const index = order.indexOf(field);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= order.length) return block;
    const nextOrder = order.slice();
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    return { ...block, fieldOrder: nextOrder };
  });
}

export function hideBlockField(resume, sectionId, blockId, field) {
  return updateBlock(resume, sectionId, blockId, (block) => {
    const hiddenFields = new Set(block.hiddenFields ?? []);
    hiddenFields.add(field);
    return { ...block, hiddenFields: [...hiddenFields] };
  });
}

export function showBlockField(resume, sectionId, blockId, field) {
  return updateBlock(resume, sectionId, blockId, (block) => ({
    ...block,
    hiddenFields: (block.hiddenFields ?? []).filter((item) => item !== field),
  }));
}

export function translateFieldValue(text, field, targetLanguage) {
  const source = String(text ?? "").trim();
  if (!source) return "";
  if (targetLanguage === "en") return translateToEnglish(source, field);
  return translateToChinese(source, field);
}

export function translateResumeToLanguage(resume, language) {
  const sourceLanguage = language === "en" ? "zh" : "en";
  return {
    ...resume,
    language,
    sections: resume.sections.map((section) => ({
      ...section,
      title: SECTION_TITLES[section.type] ?? section.title,
      content: section.content.map((block) => ({
        ...block,
        translationStatus: "machine",
        fields: Object.fromEntries(
          Object.entries(block.fields).map(([field, value]) => [
            field,
            {
              ...value,
              [language]: translateFieldValue(value[sourceLanguage] || value[language], field, language),
            },
          ]),
        ),
      })),
    })),
  };
}

export function formatYearMonth(year, month) {
  const normalizedYear = String(year ?? "").trim();
  const normalizedMonth = String(month ?? "").trim().padStart(2, "0");
  return `${normalizedYear}.${normalizedMonth}`;
}

export function applyMachineTranslation(resume, patch) {
  return updateBlockField(resume, patch, "machine");
}

export function updateTranslatedField(resume, patch) {
  return updateBlockField(resume, patch, "reviewed");
}

export function calculateLayoutFit(resume) {
  const visibleSections = sortSections(resume.sections).filter((section) => section.visible);
  const contentLength = getResumeContentLength(resume);
  const photoPenalty = resume.photo ? 120 : 0;
  const rawLength = contentLength + photoPenalty;
  const targetPages = resume.targetPages === "auto" ? Math.max(1, Math.ceil(rawLength / 980)) : resume.targetPages;
  const compactLevel = rawLength > targetPages * 1120 ? 2 : rawLength > targetPages * 900 ? 1 : 0;
  const pageCapacity = getPageCapacity(compactLevel);
  const estimatedPages = Math.max(1, Math.ceil(rawLength / pageCapacity));
  const exceedsTarget = resume.targetPages !== "auto" && estimatedPages > targetPages;
  const suggestions = [];
  if (exceedsTarget) suggestions.push("缩短经历描述，优先保留量化结果和金融关键词。");
  if (visibleSections.length > 7 && exceedsTarget) suggestions.push("合并技能、语言或奖项模块，减少模块间距。");
  if (compactLevel > 0) suggestions.push(compactLevel === 2 ? "降低字号并收紧行距，但不删除用户内容。" : "适度压缩模块间距以贴合目标页数。");
  if (suggestions.length === 0) suggestions.push("当前内容适合目标页数，可继续优化关键词表达。");
  return { targetPages, estimatedPages, compactLevel, pageCapacity, contentLength: rawLength, exceedsTarget, contentWasDeleted: false, suggestions };
}

export function getResumePages(resume) {
  const fit = calculateLayoutFit(resume);
  const targetPageCount = Math.max(1, fit.targetPages);
  const pages = Array.from({ length: targetPageCount }, () => ({ sections: [], contentLength: 0 }));
  const capacity = Math.max(480, Math.ceil(fit.contentLength / targetPageCount), fit.pageCapacity);

  for (const section of sortSections(resume.sections).filter((item) => item.visible)) {
    const sectionLength = Math.max(80, getSectionText(section, resume.language).length + section.title[resume.language].length * 2);
    let pageIndex = pages.findIndex((page) => page.contentLength > 0 && page.contentLength + sectionLength <= capacity);
    if (pageIndex === -1) {
      pageIndex = pages.findIndex((page) => page.sections.length === 0);
    }
    if (pageIndex === -1) {
      pageIndex = pages.length - 1;
    }
    pages[pageIndex].sections.push(section);
    pages[pageIndex].contentLength += sectionLength;
  }

  return pages;
}

export function getResumeLayoutSettings(resume) {
  const layout = resume.layout ?? {};
  return {
    pageMarginMm: clampNumber(layout.pageMarginMm, 8, 24, DEFAULT_RESUME_LAYOUT_SETTINGS.pageMarginMm),
    fontScale: clampNumber(layout.fontScale, 0.9, 1.18, DEFAULT_RESUME_LAYOUT_SETTINGS.fontScale),
    sectionGap: clampNumber(layout.sectionGap, 6, 20, DEFAULT_RESUME_LAYOUT_SETTINGS.sectionGap),
  };
}

export function getResumePlainText(resume, language = resume.language) {
  return sortSections(resume.sections).filter((section) => section.visible).map((section) => `${section.title[language]}\n${getSectionText(section, language)}`).join("\n\n");
}

export function getVisibleFieldOrder(block) {
  const hiddenFields = new Set(block.hiddenFields ?? []);
  return getFieldOrder(block).filter((field) => !hiddenFields.has(field));
}

function block(id, pairs) {
  const fields = Object.fromEntries(Object.entries(pairs).map(([field, [zh, en]]) => [field, { zh, en }]));
  return { id, fields, fieldOrder: Object.keys(fields), hiddenFields: [], translationStatus: "reviewed" };
}

function updateBlock(resume, sectionId, blockId, updater) {
  return {
    ...resume,
    sections: resume.sections.map((section) => {
      if (section.id !== sectionId && section.type !== sectionId) return section;
      return { ...section, content: section.content.map((block) => (block.id === blockId ? updater(block) : block)) };
    }),
  };
}

function translateToEnglish(text, field) {
  if (TRANSLATION_DICTIONARY.has(text)) return TRANSLATION_DICTIONARY.get(text);
  let translated = text;
  for (const [zh, en] of TRANSLATION_DICTIONARY.entries()) translated = translated.replaceAll(zh, en);
  translated = translated.replaceAll("，", ", ").replaceAll("；", "; ").replaceAll("。", ".").replaceAll("、", ", ").replace(/\s+/g, " ").trim();
  if (translated !== text) return translated;
  if (["startDate", "endDate", "phone", "email", "gpa"].includes(field)) return text;
  return `Please translate: ${text}`;
}

function translateToChinese(text, field) {
  const normalized = text.trim().toLowerCase();
  if (REVERSE_TRANSLATION_DICTIONARY.has(normalized)) return REVERSE_TRANSLATION_DICTIONARY.get(normalized);
  let translated = text;
  for (const [en, zh] of REVERSE_TRANSLATION_DICTIONARY.entries()) translated = translated.replace(new RegExp(escapeRegExp(en), "gi"), zh);
  if (translated !== text) return translated;
  if (["startDate", "endDate", "phone", "email", "gpa"].includes(field)) return text;
  return `请翻译：${text}`;
}

function applyResumeOverrides(resume, overrides) {
  const next = { ...resume, ...overrides };
  if (overrides.sections) next.sections = mergeSectionContent(resume.sections, overrides.sections);
  return next;
}

function mergeSectionContent(baseSections, sectionOverrides) {
  const additions = new Map(sectionOverrides.map((entry) => [entry.type, entry.content]));
  return baseSections.map((section) => {
    if (!additions.has(section.type)) return section;
    const content = additions.get(section.type);
    const primaryField = section.type === "experience" ? "achievements" : section.type === "projects" ? "projectResult" : section.type === "selfEvaluation" ? "evaluation" : "evaluation";
    return {
      ...section,
      content: section.content.map((block, index) =>
        index === 0 ? { ...block, fields: { ...block.fields, [primaryField]: { zh: content, en: translateFieldValue(content, primaryField, "en") } }, translationStatus: "reviewed" } : block,
      ),
    };
  });
}

function updateBlockField(resume, patch, translationStatus) {
  return updateBlock(resume, patch.sectionId, patch.blockId, (block) => ({
    ...block,
    translationStatus,
    fieldOrder: block.fieldOrder?.includes(patch.field) ? block.fieldOrder : [...getFieldOrder(block), patch.field],
    fields: { ...block.fields, [patch.field]: { ...(block.fields[patch.field] ?? { zh: "", en: "" }), [patch.language]: patch.text } },
  }));
}

function sortSections(sections) {
  return sections.slice().sort((a, b) => a.order - b.order);
}

function normalizeOrder(sections) {
  return sections.map((section, index) => ({ ...section, order: index }));
}

function getResumeContentLength(resume) {
  return sortSections(resume.sections)
    .filter((section) => section.visible)
    .reduce((total, section) => total + getSectionText(section, resume.language).length, 0);
}

function getPageCapacity(compactLevel) {
  if (compactLevel === 2) return 1120;
  if (compactLevel === 1) return 1020;
  return 900;
}

function getFieldOrder(block) {
  return block.fieldOrder?.length ? block.fieldOrder.filter((field) => field in block.fields) : Object.keys(block.fields);
}

function getSectionText(section, language) {
  return section.content.map((block) => getVisibleFieldOrder(block).map((field) => block.fields[field]?.[language] ?? block.fields[field]?.zh ?? block.fields[field]?.en ?? "").join(" ")).join(" ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
