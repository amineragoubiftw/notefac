import { type ModuleGrades, type ExamType, moduleFinalNote } from "@/lib/lmd-data";

interface ModuleRowProps {
  name: string;
  coef: number;
  examTypes: ExamType[];
  grades: ModuleGrades;
  onChange: (field: keyof ModuleGrades, value: string) => void;
}

const LABELS: Record<ExamType, string> = { examen: "Exam", ds: "DS", cc: "CC", ds1: "DS1", ds2: "DS2", control: "Control" };

export function ModuleRow({ name, coef, examTypes, grades, onChange }: ModuleRowProps) {
  const finalNote = moduleFinalNote(grades, examTypes);

  return (
    <div className="flex flex-wrap items-center gap-3 py-2.5">
      <div className="flex-1 min-w-[140px]">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="ml-2 text-xs text-muted-foreground">(Coef {coef})</span>
      </div>
      <div className="flex items-center gap-2">
        {examTypes.map((field) => (
          <div key={field} className="flex flex-col items-center gap-0.5">
            <label className="text-[10px] uppercase text-muted-foreground tracking-wider">
              {LABELS[field]}
            </label>
            <input
              type="number"
              min={0}
              max={20}
              step={0.25}
              placeholder="--"
              value={grades[field] ?? ""}
              onChange={(e) => onChange(field, e.target.value)}
              className="glass-input w-16 text-center tabular-nums"
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-0.5 ml-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Note</span>
          <span
            className={`w-16 text-center text-sm font-bold tabular-nums py-2 rounded-lg ${
              finalNote !== null
                ? finalNote >= 10
                  ? "text-success"
                  : "text-danger"
                : "text-muted-foreground"
            }`}
          >
            {finalNote !== null ? finalNote.toFixed(2) : "--"}
          </span>
        </div>
      </div>
    </div>
  );
}
