import { motion } from "framer-motion";
import { type UE, type ModuleGrades, ueAverage } from "@/lib/grade-data";
import { ModuleRow } from "./ModuleRow";

interface UECardProps {
  ue: UE;
  index: number;
  grades: Record<string, ModuleGrades>;
  onGradeChange: (moduleName: string, field: keyof ModuleGrades, value: string) => void;
}

export function UECard({ ue, index, grades, onGradeChange }: UECardProps) {
  const avg = ueAverage(ue.modules, grades);
  const acquired = avg !== null && avg >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-foreground">{ue.name}</h3>
          <span className="text-xs text-muted-foreground">
            Coef {ue.coef} · {ue.credits} crédits
          </span>
        </div>
        {avg !== null && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              acquired
                ? "bg-success/15 text-success border border-success/30"
                : "bg-danger/15 text-danger border border-danger/30"
            }`}
          >
            {avg.toFixed(2)}
          </div>
        )}
      </div>
      <div className="divide-y divide-glass-border">
        {ue.modules.map((mod) => (
          <ModuleRow
            key={mod.name}
            name={mod.name}
            coef={mod.coef}
            grades={grades[mod.name] || { examen: "", ds: "", cc: "" }}
            onChange={(field, value) => onGradeChange(mod.name, field, value)}
          />
        ))}
      </div>
    </motion.div>
  );
}
