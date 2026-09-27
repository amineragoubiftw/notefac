import { type ModuleGrades, type ExamType, type Rg, moduleComputedNote } from "@/lib/lmd-data";

interface ModuleRowProps {
  name: string;
  coef: number;
  examTypes: ExamType[];
  grades: ModuleGrades;
  rg?: Rg;
  onChange: (field: keyof ModuleGrades, value: string) => void;
}

const LABELS: Record<ExamType, string> = { examen: "Exam", ds: "DS", cc: "CC", ds1: "DS1", ds2: "DS2", control: "Control" };

export function ModuleRow({ name, coef, examTypes, grades, rg, onChange }: ModuleRowProps) {
  const finalNote = moduleComputedNote(grades, examTypes, rg);

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 py-2.5">
      <div className="flex-1 min-w-0 sm:min-w-[140px]">
        <span className="text-sm font-medium text-foreground break-words">{name}</span>
        <span className="ml-2 text-xs text-muted-foreground">({rg ? "Coef EE" : "Coef"} {coef})</span>
      </div>
      <div className="flex flex-wrap items-end gap-2 sm:gap-2">
        {examTypes.map((field) => (
          <div key={field} className="flex flex-col items-center gap-0.5">
            <label className="text-[10px] uppercase text-muted-foreground tracking-wider">
              {LABELS[field]}
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.25}
              placeholder="--"
              value={grades[field] ?? ""}
              onChange={(e) => onChange(field, e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              className="glass-input w-14 sm:w-16 text-center tabular-nums"
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-0.5 ml-0 sm:ml-1">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Note</span>
          <span
            className={`w-14 sm:w-16 text-center text-sm font-bold tabular-nums py-2 rounded-lg ${
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
        <div className="flex flex-col items-center gap-0.5">
          <label className="text-[10px] uppercase text-muted-foreground tracking-wider">
            Control
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={20}
            step={0.25}
            placeholder="--"
            value={grades.control ?? ""}
            onChange={(e) => onChange("control", e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            className="glass-input w-14 sm:w-16 text-center tabular-nums"
          />
        </div>
      </div>
    </div>
  );
}
