import { Check } from "lucide-react";

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
    if (step === 1) return section1Submitted ? "completed" : "in-progress";
    if (step === 2) return section2Submitted ? "completed" : "in-progress";
    if (step === 3) return section3Submitted ? "completed" : "in-progress";
    return "in-progress";
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
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {status === "completed" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline text-foreground">
                  Section {step}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    getStepStatus(step + 1) === "completed"
                      ? "bg-lead-green"
                      : "bg-accent"
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
