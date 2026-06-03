const DEFAULT_SECTION_ORDER = ["profile", "selfEvaluation", "education", "experience", "projects", "skills", "awards", "languages"];
const TRANSLATION_DICTIONARY = new Map([
  ["林予安", "Yuan Lin"],
  ["复旦大学", "Fudan University"],
  ["上海财经大学", "Shanghai University of Finance and Economics"],
  ["金融硕士", "Master of Finance"],
  ["金融分析师", "Financial Analyst"],
  ["投行实习生", "Investment Banking Intern"],
  ["上海", "Shanghai"],
  ["华东证券研究所", "Huadong Securities Research Institute"],
  ["行研实习生", "Equity Research Intern"],
  ["消费行业并购案例研究", "Consumer M&A Case Study"],
  ["估值", "valuation"],
  ["财务建模", "financial modeling"],
  ["尽调", "due diligence"],
  ["证券从业资格", "Securities Qualification Certificate"],
]);
const SECTION_TITLES = {
  profile: { zh: "基本信息", en: "Contact" },
  selfEvaluation: { zh: "自我评价", en: "About" },
  education: { zh: "教育背景", en: "Education" },
  experience: { zh: "实习/工作经历", en: "Experience" },
  projects: { zh: "项目/交易/研究经历", en: "Projects" },
  skills: { zh: "技能、工具与证书", en: "Skills, Tools & Certifications" },
  awards: { zh: "获奖经历", en: "Awards" },
  languages: { zh: "语言能力", en: "Languages" },
};

const labels = {
  name: "姓名",
  targetRole: "目标岗位",
  phone: "电话",
  email: "邮箱",
  city: "所在城市",
  evaluation: "自我评价",
  strengths: "核心优势",
  school: "学校",
  degree: "学历",
  detail: "详情",
  company: "公司",
  role: "角色",
  bullets: "经历描述",
  title: "标题",
  skills: "技能",
    certifications: "证书",
  awards: "奖项",
  languages: "语言",
};

let activeSectionId = "profile";
let previewOpen = false;
let resume = createDefaultResume();

function createDefaultResume() {
  const blocks = {
    profile: [{ id: "profile-main", fields: { name: { zh: "林予安", en: "Yuan Lin" }, targetRole: { zh: "金融分析师 / 投行实习生", en: "Financial Analyst / Investment Banking Intern" }, phone: { zh: "138-0000-0000", en: "+86 138-0000-0000" }, email: { zh: "yuan.lin@example.com", en: "yuan.lin@example.com" }, city: { zh: "上海", en: "Shanghai" } }, translationStatus: "reviewed" }],
    selfEvaluation: [{ id: "self-evaluation-main", fields: { evaluation: { zh: "金融硕士候选人，具备估值、财务建模、行业研究和尽职调查经验，关注消费、TMT 与新能源方向。", en: "Finance master's candidate with experience in valuation, financial modeling, industry research, and due diligence." }, strengths: { zh: "擅长把公开资料、财务数据和行业逻辑整理成可执行结论，能独立完成模型搭建与报告底稿。", en: "Able to translate public information, financial data, and sector logic into actionable conclusions; independently builds models and research drafts." } }, translationStatus: "reviewed" }],
    education: [{ id: "education-main", fields: { school: { zh: "上海财经大学", en: "Shanghai University of Finance and Economics" }, degree: { zh: "金融硕士", en: "Master of Finance" }, detail: { zh: "GPA 3.8/4.0，核心课程：公司金融、投资学、财务报表分析。", en: "GPA 3.8/4.0. Coursework: Corporate Finance, Investments, Financial Statement Analysis." } }, translationStatus: "reviewed" }],
    experience: [{ id: "experience-main", fields: { company: { zh: "华东证券研究所", en: "Huadong Securities Research Institute" }, role: { zh: "行研实习生", en: "Equity Research Intern" }, bullets: { zh: "参与 12 家上市公司财务拆解，搭建三表模型并输出估值敏感性分析；整理 Wind 与公告数据，支持新能源板块周报。", en: "Analyzed 12 listed companies, built three-statement models, and prepared valuation sensitivity analysis; compiled Wind and filing data for weekly new-energy sector reports." } }, translationStatus: "reviewed" }],
    projects: [{ id: "projects-main", fields: { title: { zh: "消费行业并购案例研究", en: "Consumer M&A Case Study" }, bullets: { zh: "基于 DCF、可比公司和可比交易法评估标的价值，测算 30 亿元交易规模下的协同效应。", en: "Valued the target with DCF, trading comps, and transaction comps; estimated synergies under a RMB 3bn deal scenario." } }, translationStatus: "reviewed" }],
    skills: [{ id: "skills-main", fields: { skills: { zh: "Wind、Bloomberg、Excel VBA、Python、SQL、财务建模、估值分析", en: "Wind, Bloomberg, Excel VBA, Python, SQL, financial modeling, valuation" }, certifications: { zh: "CFA Level I Candidate、证券从业资格", en: "CFA Level I Candidate, Securities Qualification Certificate" } }, translationStatus: "reviewed" }],
    awards: [{ id: "awards-main", fields: { awards: { zh: "校级一等奖学金、全国大学生金融建模竞赛二等奖", en: "First-class University Scholarship, National Financial Modeling Competition Second Prize" } }, translationStatus: "reviewed" }],
    languages: [{ id: "languages-main", fields: { languages: { zh: "英语 CET-6，具备英文研报阅读与双语简历表达能力", en: "CET-6 English; able to read English research reports and prepare bilingual resumes" } }, translationStatus: "reviewed" }],
  };
  return {
    id: "resume-finance-demo",
    title: "金融分析师中文简历",
    targetRole: "金融分析师",
    targetIndustry: "investment_banking",
    language: "zh",
    targetPages: 1,
    themeId: "finance-classic",
    photo: "",
    sections: DEFAULT_SECTION_ORDER.map((type, order) => ({ id: type, type, title: SECTION_TITLES[type], order, visible: true, content: structuredClone(blocks[type]) })),
  };
}

function sortedSections() {
  return resume.sections.slice().sort((a, b) => a.order - b.order);
}

function normalizeOrder(sections) {
  return sections.map((section, order) => ({ ...section, order }));
}

function moveSection(sectionId, direction) {
  const sections = sortedSections();
  const index = sections.findIndex((section) => section.id === sectionId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= sections.length) return;
  [sections[index], sections[target]] = [sections[target], sections[index]];
  resume.sections = normalizeOrder(sections);
  render();
}

function reorderBefore(draggedId, targetId) {
  if (!draggedId || draggedId === targetId) return;
  const sections = sortedSections();
  const dragged = sections.find((section) => section.id === draggedId);
  const next = sections.filter((section) => section.id !== draggedId);
  const targetIndex = next.findIndex((section) => section.id === targetId);
  next.splice(targetIndex, 0, dragged);
  resume.sections = normalizeOrder(next);
  render();
}

function restoreOrder() {
  const byType = new Map(resume.sections.map((section) => [section.type, section]));
  resume.sections = DEFAULT_SECTION_ORDER.map((type, order) => ({ ...byType.get(type), order }));
  render();
}

function calculateLayoutFit() {
  const textLength = sortedSections().filter((section) => section.visible).reduce((total, section) => total + sectionText(section).length, 0) + (resume.photo ? 120 : 0);
  const targetPages = resume.targetPages === "auto" ? Math.max(1, Math.ceil(textLength / 980)) : resume.targetPages;
  const compactLevel = textLength > targetPages * 1120 ? 2 : textLength > targetPages * 900 ? 1 : 0;
  const capacity = compactLevel === 2 ? 1120 : compactLevel === 1 ? 1020 : 900;
  const estimatedPages = Math.max(1, Math.ceil(textLength / capacity));
  const exceedsTarget = resume.targetPages !== "auto" && estimatedPages > targetPages;
  const suggestions = exceedsTarget
    ? ["缩短经历描述，优先保留量化结果和金融关键词。", "合并技能、语言或奖项模块，减少模块间距。", "降低字号并收紧行距，但不删除用户内容。"]
    : ["当前内容适合目标页数，可继续优化关键词表达。"];
  return { targetPages, estimatedPages, compactLevel, exceedsTarget, suggestions };
}

function getPreviewPages() {
  const fit = calculateLayoutFit();
  const pages = Array.from({ length: fit.targetPages }, () => []);
  sortedSections().filter((section) => section.visible).forEach((section, index) => {
    pages[Math.min(index, pages.length - 1)].push(section);
  });
  return pages;
}

function sectionText(section) {
  return section.content.map((block) => Object.values(block.fields).map((value) => value[resume.language] || value.zh || value.en || "").join(" ")).join(" ");
}

function render() {
  document.querySelector("#targetPages").value = String(resume.targetPages);
  document.querySelector("#themeId").value = resume.themeId;
  document.querySelector("#workspace").classList.toggle("preview-open", previewOpen);
  document.querySelector("#workspace").classList.toggle("preview-closed", !previewOpen);
  document.querySelector("#previewPanel").hidden = !previewOpen;
  document.querySelector("#previewToggle").textContent = previewOpen ? "收起预览" : "预览简历";
  document.querySelector("#previewToggle").className = previewOpen ? "primary-button" : "ghost-button";
  renderSections();
  renderForm();
  renderAdvisor();
  renderPreview();
  document.querySelector("#saveState").textContent = `已保存 ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
}

function renderSections() {
  const list = document.querySelector("#sectionList");
  list.innerHTML = "";
  sortedSections().forEach((section, index, arr) => {
    const li = document.createElement("li");
    li.className = section.id === activeSectionId ? "selected" : "";
    li.draggable = true;
    li.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", section.id));
    li.addEventListener("dragover", (event) => event.preventDefault());
    li.addEventListener("drop", (event) => {
      event.preventDefault();
      reorderBefore(event.dataTransfer.getData("text/plain"), section.id);
    });
    li.innerHTML = `<button class="section-name" type="button"><span>${index + 1}</span>${section.title[resume.language]}</button>
      <div class="section-tools">
        <button title="上移模块" ${index === 0 ? "disabled" : ""}>↑</button>
        <button title="下移模块" ${index === arr.length - 1 ? "disabled" : ""}>↓</button>
        <button title="${section.visible ? "隐藏模块" : "显示模块"}">${section.visible ? "●" : "○"}</button>
      </div>`;
    li.querySelector(".section-name").addEventListener("click", () => {
      activeSectionId = section.id;
      render();
    });
    const [up, down, toggle] = li.querySelectorAll(".section-tools button");
    up.addEventListener("click", () => moveSection(section.id, "up"));
    down.addEventListener("click", () => moveSection(section.id, "down"));
    toggle.addEventListener("click", () => {
      section.visible = !section.visible;
      render();
    });
    list.append(li);
  });
}

function renderForm() {
  const section = resume.sections.find((item) => item.id === activeSectionId) || resume.sections[0];
  document.querySelector("#activeTitle").textContent = section.title[resume.language];
  const status = document.querySelector("#translationStatus");
  status.textContent = section.content[0]?.translationStatus || "empty";
  status.className = `status-pill status-${section.content[0]?.translationStatus || "empty"}`;
  const group = document.querySelector("#fieldGroup");
  group.innerHTML = "";
  section.content.forEach((block) => {
    Object.entries(block.fields).forEach(([field, value]) => {
      const label = document.createElement("label");
      label.innerHTML = `<span>${labels[field] || field}</span><textarea rows="${["bullets", "evaluation", "strengths", "detail"].includes(field) ? 5 : 2}"></textarea>`;
      const textarea = label.querySelector("textarea");
      textarea.value = value[resume.language] || "";
      textarea.addEventListener("input", () => {
        value[resume.language] = textarea.value;
        if (resume.language === "en") block.translationStatus = "reviewed";
        renderAdvisor();
        renderPreview();
      });
      group.append(label);
    });
  });
}

function renderAdvisor() {
  const fit = calculateLayoutFit();
  const advisor = document.querySelector("#advisor");
  advisor.innerHTML = `<div class="advisor-metric"><span>页数</span><strong class="${fit.exceedsTarget ? "danger" : "ok"}">${fit.estimatedPages}/${fit.targetPages}</strong></div>
    <ul>${fit.suggestions.slice(0, 5).map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderPreview() {
  const fit = calculateLayoutFit();
  const pageCount = document.querySelector("#pageCount");
  const pages = getPreviewPages();
  pageCount.textContent = `${pages.length}/${fit.targetPages} 页`;
  pageCount.className = fit.exceedsTarget ? "danger" : "ok";
  const wrapper = document.querySelector("#previewPages");
  wrapper.innerHTML = "";
  const language = resume.language;
  const sections = sortedSections().filter((section) => section.visible);
  const profileBlock = sections.find((section) => section.type === "profile")?.content[0];
  pages.forEach((pageSections, pageIndex) => {
    const page = document.createElement("article");
    page.className = `resume-page compact-${fit.compactLevel} theme-${resume.themeId}`;
    page.innerHTML = `${pageIndex === 0 ? `<header class="resume-header">
        <div><h2>${profileBlock?.fields.name?.[language] || ""}</h2>
        <p>${profileBlock?.fields.targetRole?.[language] || ""}</p>
        <div><span>${profileBlock?.fields.phone?.[language] || ""}</span><span>${profileBlock?.fields.email?.[language] || ""}</span><span>${profileBlock?.fields.city?.[language] || ""}</span></div></div>
        ${resume.photo ? `<img class="resume-photo" src="${resume.photo}" alt="个人照片" />` : ""}
      </header>` : `<header class="resume-page-continuation"><span>${profileBlock?.fields.name?.[language] || ""}</span><span>Page ${pageIndex + 1}</span></header>`}
      ${pageSections.filter((section) => section.type !== "profile").map((section) => `<section class="resume-section"><h3>${section.title[language]}</h3>${section.content.map((block) => `<div class="resume-block">${Object.entries(block.fields).map(([, value]) => `<p>${value[language] || ""}</p>`).join("")}</div>`).join("")}</section>`).join("")}
      ${pageSections.length === 0 ? `<p class="empty-page-note">此页作为目标页数占位。</p>` : ""}
      <footer class="resume-footer">第 ${pageIndex + 1} 页</footer>`;
    wrapper.append(page);
  });
}

document.querySelector("#exportEnglish").addEventListener("click", () => {
  const previousLanguage = resume.language;
  resume.sections.forEach((section) => section.content.forEach((block) => {
    Object.entries(block.fields).forEach(([field, value]) => {
      value.en = translateToEnglish(value.zh || value.en || "", field);
    });
  }));
  resume.language = "en";
  render();
  window.print();
  resume.language = previousLanguage;
  render();
});
document.querySelector("#targetPages").addEventListener("change", (event) => {
  resume.targetPages = event.target.value === "auto" ? "auto" : Number(event.target.value);
  render();
});
document.querySelector("#themeId").addEventListener("change", (event) => {
  resume.themeId = event.target.value;
  render();
});
document.querySelector("#restoreOrder").addEventListener("click", restoreOrder);
document.querySelector("#previewToggle").addEventListener("click", () => {
  previewOpen = !previewOpen;
  render();
});
document.querySelector("#uploadPhotoButton").addEventListener("click", () => document.querySelector("#photoInput").click());
document.querySelector("#photoInput").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resume.photo = String(reader.result || "");
    render();
  });
  reader.readAsDataURL(file);
});
document.querySelector("#editTab").addEventListener("click", () => {
  document.querySelector("#workspace").className = "workspace view-edit";
  document.querySelector("#editTab").classList.add("active");
  document.querySelector("#previewTab").classList.remove("active");
});
document.querySelector("#previewTab").addEventListener("click", () => {
  document.querySelector("#workspace").className = "workspace view-preview";
  document.querySelector("#previewTab").classList.add("active");
  document.querySelector("#editTab").classList.remove("active");
});
render();

function translateToEnglish(text, field) {
  if (["phone", "email", "gpa"].includes(field)) return text;
  let translated = String(text || "");
  for (const [zh, en] of TRANSLATION_DICTIONARY.entries()) {
    translated = translated.replaceAll(zh, en);
  }
  return translated
    .replaceAll("，", ", ")
    .replaceAll("；", "; ")
    .replaceAll("。", ".")
    .replaceAll("、", ", ")
    .replace(/\s+/g, " ")
    .trim();
}
