import { motion } from "framer-motion";
import {
  type UE,
  type ModuleGrades,
  ueAverage,
  semesterAverage,
  totalCredits,
} from "@/lib/grade-data";

interface ResultsPanelProps {
  ues: UE[];
  grades: Record<string, ModuleGrades>;
  maxCredits: number;
}

export function ResultsPanel({ ues, grades, maxCredits }: ResultsPanelProps) {
  const avg = semesterAverage(ues, grades);
  const credits = totalCredits(ues, grades);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 sticky top-6"
    >
      <h2 className="text-lg font-bold text-foreground mb-5">Résultats</h2>

      {/* Semester Average */}
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Moyenne Semestre
        </p>
        <p
          className={`text-5xl font-extrabold tabular-nums ${
            avg !== null
              ? avg >= 10
                ? "text-success glow-text"
                : "text-danger"
              : "text-muted-foreground"
          }`}
          style={avg !== null && avg >= 10 ? { "--glow": "var(--success)" } as React.CSSProperties : undefined}
        >
          {avg !== null ? avg.toFixed(2) : "--"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">/20</p>
      </div>

      {/* Credits */}
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Crédits Validés
        </p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {credits}
          <span className="text-lg text-muted-foreground font-normal">/{maxCredits}</span>
        </p>
        <div className="mt-2 h-2 rounded-full bg-glass overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(credits / maxCredits) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* UE Breakdown */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Détail par UE
        </p>
        {ues.map((ue) => {
          const a = ueAverage(ue.modules, grades);
          const ok = a !== null && a >= 10;
          return (
            <div
              key={ue.name}
              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-glass"
            >
              <span className="text-sm font-medium text-foreground">
                {ue.name}
                <span className="text-xs text-muted-foreground ml-1.5">
                  ({ue.credits} cr)
                </span>
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  a !== null
                    ? ok
                      ? "text-success"
                      : "text-danger"
                    : "text-muted-foreground"
                }`}
              >
                {a !== null ? a.toFixed(2) : "--"}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
