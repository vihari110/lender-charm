import { Check, Lock } from "lucide-react";

interface LeadStepperProps {
  completedSections: number;
  totalSections: number;
  section1Submitted: boolean;
  section2Submitted: boolean;
  section3Submitted: boolean;
}

export function LeadStepper({
  completedSections,
  totalSections,
  section1Submitted,
  section2Submitted,
  section3Submitted,
}: LeadStepperProps) {
  const getStepStatus = (step: number) => {
    if (step === 1) {
      return section1Submitted ? "completed" : "in-progress";
    }
    if (step === 2) {
      if (section2Submitted) return "completed";
      return section1Submitted ? "in-progress" : "locked";
    }
    if (step === 3) {
      if (section3Submitted) return "completed";
      return section1Submitted && section2Submitted ? "in-progress" : "locked";
    }
    return "locked";
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground">
          {completedSections}/{totalSections} Sections
        </span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step, index) => {
          const status = getStepStatus(step);
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    status === "completed"
                      ? "bg-lead-green text-primary-foreground"
                      : status === "in-progress"
                      ? "bg-lead-orange text-primary-foreground"
                      : "bg-lead-gray text-muted-foreground"
                  }`}
                >
                  {status === "completed" ? (
                    <Check className="w-4 h-4" />
                  ) : status === "locked" ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    status === "locked" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  Section {step}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    getStepStatus(step + 1) !== "locked"
                      ? "bg-lead-green"
                      : "bg-lead-gray"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
