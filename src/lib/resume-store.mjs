import {
  applyMachineTranslation,
  calculateLayoutFit,
  createDefaultResume,
  moveSection,
  reorderSectionBefore,
  restoreRecommendedOrder,
  updateTranslatedField,
} from "./resume-core.mjs";

const resumes = new Map();
const initialResume = createDefaultResume();
resumes.set(initialResume.id, initialResume);

export function createResume(payload = {}) {
  const resume = createDefaultResume({
    id: `resume-${Date.now()}`,
    title: payload.title ?? "金融求职简历",
    targetRole: payload.targetRole ?? "金融分析师",
    targetPages: payload.targetPages ?? 1,
    layout: payload.layout,
  });
  resumes.set(resume.id, resume);
  return resume;
}

export function getResume(id) {
  return resumes.get(id) ?? initialResume;
}

export function updateResume(id, patch) {
  const current = getResume(id);
  const next = {
    ...current,
    ...patch,
    sections: patch.sections ?? current.sections,
    versions: [
      {
        id: `v-${Date.now()}`,
        label: "自动保存",
        createdAt: new Date().toISOString(),
      },
      ...current.versions.slice(0, 4),
    ],
  };
  resumes.set(id, next);
  return next;
}

export function reorderResumeSection(id, sectionId, direction, targetSectionId) {
  const current = getResume(id);
  const next =
    direction === "recommended"
      ? restoreRecommendedOrder(current)
      : direction === "before"
        ? reorderSectionBefore(current, sectionId, targetSectionId)
        : moveSection(current, sectionId, direction);
  resumes.set(id, next);
  return next;
}

export function translateResumeField(id, patch) {
  const next = applyMachineTranslation(getResume(id), patch);
  resumes.set(id, next);
  return next;
}

export function reviewResumeField(id, patch) {
  const next = updateTranslatedField(getResume(id), patch);
  resumes.set(id, next);
  return next;
}

export function fitResumeLayout(id) {
  return calculateLayoutFit(getResume(id));
}
