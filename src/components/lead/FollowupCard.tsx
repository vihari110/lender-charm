import { Trash2 } from "lucide-react";

interface Followup {
  id: string;
  visitMode: string;
  date: string;
  nextFollowupDate: string;
  photos: FileList | null;
  description: string;
}

interface FollowupCardProps {
  followup: Followup;
  index: number;
  disabled: boolean;
  visitModeOptions: string[];
  onChange: (id: string, field: keyof Followup, value: any) => void;
  onRemove: (id: string) => void;
}

export function FollowupCard({
  followup,
  index,
  disabled,
  visitModeOptions,
  onChange,
  onRemove,
}: FollowupCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">
          New Followup #{index + 1} (Editable)
        </h4>
        <button
          type="button"
          onClick={() => onRemove(followup.id)}
          disabled={disabled}
          className="text-destructive hover:text-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          REMOVE FOLLOWUP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Followup visit mode*</label>
          <select
            className="form-select"
            value={followup.visitMode}
            onChange={(e) => onChange(followup.id, "visitMode", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select mode</option>
            {visitModeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Date*</label>
          <input
            type="date"
            className="form-input"
            value={followup.date}
            onChange={(e) => onChange(followup.id, "date", e.target.value)}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground mt-1">Date of the visit</p>
        </div>

        <div>
          <label className="form-label">Next Followup Date</label>
          <input
            type="date"
            className="form-input"
            value={followup.nextFollowupDate}
            onChange={(e) => onChange(followup.id, "nextFollowupDate", e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="form-label">Photos</label>
          <input
            type="file"
            multiple
            className="form-input"
            onChange={(e) => onChange(followup.id, "photos", e.target.files)}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Upload one or more photos from the visit
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="form-label">Description*</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={followup.description}
          onChange={(e) => onChange(followup.id, "description", e.target.value)}
          disabled={disabled}
          placeholder="Enter followup description..."
        />
      </div>
    </div>
  );
}
