import { motion } from "framer-motion";

interface SemesterToggleProps {
  semesters: string[];
  active: number;
  onChange: (index: number) => void;
}

export function SemesterToggle({ semesters, active, onChange }: SemesterToggleProps) {
  if (semesters.length === 0) return null;
  const widthPct = 100 / semesters.length;
  return (
    <div className="glass-card relative flex p-1 w-fit mx-auto">
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl bg-primary/30 backdrop-blur-md border border-primary/40"
        animate={{ left: `calc(${active * widthPct}% + 2px)` }}
        style={{ width: `calc(${widthPct}% - 4px)` }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {semesters.map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i)}
          className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
            active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
