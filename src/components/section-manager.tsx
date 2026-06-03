"use client";

import type { ResumeLanguage, ResumeSection } from "@/lib/resume-types";

type Props = {
  activeSectionId: string;
  language: ResumeLanguage;
  sections: ResumeSection[];
  onActivate: (sectionId: string) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
  onReorderBefore: (sectionId: string, targetSectionId: string) => void;
  onRestore: () => void;
  onToggle: (sectionId: string) => void;
};

export function SectionManager({ activeSectionId, language, sections, onActivate, onMove, onReorderBefore, onRestore, onToggle }: Props) {
  const sorted = sections.slice().sort((a, b) => a.order - b.order);

  return (
    <aside className="section-manager">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Sections</p>
          <h2>模块编排</h2>
        </div>
        <button className="icon-button wide" onClick={onRestore} title="恢复金融推荐顺序">
          推荐顺序
        </button>
      </div>
      <ol className="section-list">
        {sorted.map((section, index) => (
          <li
            key={section.id}
            className={section.id === activeSectionId ? "selected" : ""}
            draggable
            onDragStart={(event) => event.dataTransfer.setData("text/plain", section.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const draggedId = event.dataTransfer.getData("text/plain");
              onReorderBefore(draggedId, section.id);
            }}
          >
            <button className="section-name" onClick={() => onActivate(section.id)}>
              <span>{index + 1}</span>
              {section.title[language]}
            </button>
            <div className="section-tools">
              <button onClick={() => onMove(section.id, "up")} title="上移模块" disabled={index === 0}>
                ↑
              </button>
              <button onClick={() => onMove(section.id, "down")} title="下移模块" disabled={index === sorted.length - 1}>
                ↓
              </button>
              <button onClick={() => onToggle(section.id)} title={section.visible ? "隐藏模块" : "显示模块"}>
                {section.visible ? "●" : "○"}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
