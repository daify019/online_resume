"use client";

import { useState } from "react";
import { FIELD_META, formatYearMonth, getVisibleFieldOrder } from "@/lib/resume-core.mjs";
import type { ResumeBlock, ResumeLanguage, ResumeSection } from "@/lib/resume-types";

type FieldPatch = {
  sectionId: string;
  blockId: string;
  field: string;
  language: ResumeLanguage;
  text: string;
};

type Props = {
  language: ResumeLanguage;
  section: ResumeSection;
  onAddBlock: (sectionId: string) => void;
  onChange: (section: ResumeSection) => void;
  onHideField: (sectionId: string, blockId: string, field: string) => void;
  onMoveBlock: (sectionId: string, blockId: string, direction: "up" | "down") => void;
  onMoveField: (sectionId: string, blockId: string, field: string, direction: "up" | "down") => void;
  onRemoveBlock: (sectionId: string, blockId: string) => void;
  onShowField: (sectionId: string, blockId: string, field: string) => void;
  onReviewField: (patch: FieldPatch) => void;
};

const repeatableSections = new Set(["education", "experience", "projects", "awards"]);
const fieldMeta = FIELD_META as Record<string, { zh: string; en: string; kind: "short" | "long" }>;
const dateFields = new Set(["startDate", "endDate"]);
const monthLabels = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

export function SectionFormPanel({ language, section, onAddBlock, onChange, onHideField, onMoveBlock, onMoveField, onRemoveBlock, onShowField, onReviewField }: Props) {
  function updateField(block: ResumeBlock, field: string, value: string) {
    const nextBlock = {
      ...block,
      translationStatus: language === "en" ? "reviewed" : block.translationStatus,
      fields: {
        ...block.fields,
        [field]: {
          ...block.fields[field],
          [language]: value,
        },
      },
    };
    onChange({
      ...section,
      content: section.content.map((item) => (item.id === block.id ? nextBlock : item)),
    });
    if (language === "en") {
      onReviewField({ sectionId: section.id, blockId: block.id, field, language, text: value });
    }
  }

  return (
    <div className="form-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Editor</p>
          <h2>{section.title[language]}</h2>
        </div>
        <div className="panel-actions">
          <span className={`status-pill status-${section.content[0]?.translationStatus ?? "empty"}`}>{section.content[0]?.translationStatus ?? "empty"}</span>
          {repeatableSections.has(section.type) ? (
            <button className="icon-button wide" onClick={() => onAddBlock(section.id)} type="button">
              新增条目
            </button>
          ) : null}
        </div>
      </div>

      {section.content.map((block, index) => {
        const visibleFields = getVisibleFieldOrder(block);
        const hiddenFields = block.hiddenFields ?? [];

        return (
          <div className="entry-card" key={block.id}>
            {section.content.length > 1 ? (
              <div className="entry-heading">
                <strong>条目 {index + 1}</strong>
                <div className="entry-actions">
                  <button className="inline-action" disabled={index === 0} onClick={() => onMoveBlock(section.id, block.id, "up")} type="button">
                    上移
                  </button>
                  <button className="inline-action" disabled={index === section.content.length - 1} onClick={() => onMoveBlock(section.id, block.id, "down")} type="button">
                    下移
                  </button>
                  <button className="inline-action danger-action" onClick={() => onRemoveBlock(section.id, block.id)} type="button">
                    删除
                  </button>
                </div>
              </div>
            ) : null}

            <div className="field-group">
              {visibleFields.map((field: string, fieldIndex: number) => {
                const value = block.fields[field];
                const meta = fieldMeta[field] ?? { zh: field, en: field, kind: "short" };
                const isLong = meta.kind === "long";
                const isDate = dateFields.has(field);
                return (
                  <label className={isLong ? "field field-long" : "field"} key={field}>
                    <span className="field-label-row">
                      <span>{meta[language]}</span>
                      <span className="field-tools">
                        <button disabled={fieldIndex === 0} onClick={() => onMoveField(section.id, block.id, field, "up")} title="上移组件" type="button">
                          ↑
                        </button>
                        <button disabled={fieldIndex === visibleFields.length - 1} onClick={() => onMoveField(section.id, block.id, field, "down")} title="下移组件" type="button">
                          ↓
                        </button>
                        <button onClick={() => onHideField(section.id, block.id, field)} title="忽略此组件" type="button">
                          忽略
                        </button>
                      </span>
                    </span>
                    {isLong ? (
                      <textarea rows={4} value={value?.[language] ?? ""} onChange={(event) => updateField(block, field, event.target.value)} />
                    ) : isDate ? (
                      <YearMonthField value={value?.[language] ?? ""} onChange={(nextValue) => updateField(block, field, nextValue)} />
                    ) : (
                      <input value={value?.[language] ?? ""} onChange={(event) => updateField(block, field, event.target.value)} />
                    )}
                  </label>
                );
              })}
            </div>

            {hiddenFields.length > 0 ? (
              <div className="hidden-fields">
                <span>已忽略组件</span>
                {hiddenFields.map((field) => {
                  const meta = fieldMeta[field] ?? { zh: field, en: field, kind: "short" };
                  return (
                    <button key={field} onClick={() => onShowField(section.id, block.id, field)} type="button">
                      恢复 {meta[language]}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function YearMonthField({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  const parsedYear = Number(String(value).match(/\d{4}/)?.[0] ?? new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(parsedYear);

  return (
    <span className="date-picker">
      <button className="date-trigger" onClick={() => setOpen((current) => !current)} type="button">
        {value || "选择年月"}
      </button>
      {open ? (
        <span className="date-popover">
          <span className="date-tabs">
            <strong>年月</strong>
            <button onClick={() => setOpen(false)} type="button">
              完成
            </button>
          </span>
          <span className="year-row">
            <button onClick={() => setYear((current) => current - 1)} type="button">
              ‹
            </button>
            <strong>{year}</strong>
            <button onClick={() => setYear((current) => current + 1)} type="button">
              ›
            </button>
          </span>
          <span className="month-grid">
            {monthLabels.map((label, index) => (
              <button
                key={label}
                onClick={() => {
                  onChange(formatYearMonth(year, index + 1));
                  setOpen(false);
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </span>
        </span>
      ) : null}
    </span>
  );
}
