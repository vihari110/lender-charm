import { Trash2 } from "lucide-react";

interface LeadHeaderProps {
  title: string;
  onClearForm: () => void;
}

export function LeadHeader({ title, onClearForm }: LeadHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary border-b-2 border-primary pb-1 inline-block">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your form data is automatically saved as you type
        </p>
      </div>
      <button
        onClick={onClearForm}
        className="btn-outline flex items-center gap-2 text-sm whitespace-nowrap"
      >
        <Trash2 className="w-4 h-4" />
        CLEAR FORM DATA
      </button>
    </div>
  );
}
