import { ReactNode } from "react";

type SectionVariant = 1 | 2 | 3;
type StatusType = "in-progress" | "not-started" | "completed";

interface LeadSectionCardProps {
  section: SectionVariant;
  title: string;
  status: StatusType;
  children: ReactNode;
}

export function LeadSectionCard({
  section,
  title,
  status,
  children,
}: LeadSectionCardProps) {
  const sectionClasses = {
    1: "lead-section-1",
    2: "lead-section-2",
    3: "lead-section-3",
  };

  const statusLabels = {
    "in-progress": "In Progress",
    "not-started": "Not Started",
    "completed": "Completed",
  };

  const statusClasses = {
    "in-progress": "status-in-progress",
    "not-started": "status-not-started",
    "completed": "status-completed",
  };

  return (
    <div className={`lead-section ${sectionClasses[section]} mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className={`status-chip ${statusClasses[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      {children}
    </div>
  );
}
