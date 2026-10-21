import { GraduationCap, Building2, BookOpen } from "lucide-react";
import { useCurriculum } from "@/lib/curriculum";

interface SelectionBarProps {
  universityId: string;
  instituteId: string;
  majorId: string;
  onChange: (sel: { universityId: string; instituteId: string; majorId: string }) => void;
}

const selectCls =
  "glass-input w-full appearance-none cursor-pointer pr-8 [&>option]:bg-card [&>option]:text-foreground";

export function SelectionBar({ universityId, instituteId, majorId, onChange }: SelectionBarProps) {
  const universities = useCurriculum();
  const uni = universities.find((u) => u.id === universityId);
  const inst = uni?.institutes.find((i) => i.id === instituteId);

  return (
    <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Field icon={<GraduationCap className="w-4 h-4" />} label="Université">
        <select
          className={selectCls}
          value={universityId}
          onChange={(e) =>
            onChange({ universityId: e.target.value, instituteId: "", majorId: "" })
          }
        >
          <option value="">— Sélectionner —</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </Field>

      <Field icon={<Building2 className="w-4 h-4" />} label="Établissement">
        <select
          className={selectCls}
          value={instituteId}
          disabled={!uni}
          onChange={(e) =>
            onChange({ universityId, instituteId: e.target.value, majorId: "" })
          }
        >
          <option value="">{uni ? "— Sélectionner —" : "Choisir d'abord l'université"}</option>
          {uni?.institutes.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </Field>

      <Field icon={<BookOpen className="w-4 h-4" />} label="Spécialité / Parcours">
        <select
          className={selectCls}
          value={majorId}
          disabled={!inst}
          onChange={(e) => onChange({ universityId, instituteId, majorId: e.target.value })}
        >
          <option value="">{inst ? "— Sélectionner —" : "Choisir d'abord l'établissement"}</option>
          {inst?.majors.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
