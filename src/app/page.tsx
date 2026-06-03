import { ResumeEditorShell } from "@/components/resume-editor-shell";
import { createDefaultResume } from "@/lib/resume-core.mjs";

export default function HomePage() {
  return <ResumeEditorShell initialResume={createDefaultResume()} />;
}
