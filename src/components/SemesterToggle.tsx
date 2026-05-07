import { motion } from "framer-motion";

interface SemesterToggleProps {
  active: number;
  onChange: (index: number) => void;
}

export function SemesterToggle({ active, onChange }: SemesterToggleProps) {
  return (
    <div className="glass-card relative flex p-1 w-fit mx-auto">
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl bg-primary/30 backdrop-blur-md border border-primary/40"
        animate={{ x: active === 0 ? 0 : "100%" }}
        style={{ width: "calc(50% - 2px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {["Semestre 1", "Semestre 2"].map((label, i) => (
        <button
          key={i}
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
