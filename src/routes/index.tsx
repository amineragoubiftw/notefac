import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { semesters, type ModuleGrades } from "@/lib/grade-data";
import { SemesterToggle } from "@/components/SemesterToggle";
import { UECard } from "@/components/UECard";
import { ResultsPanel } from "@/components/ResultsPanel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Calculateur de Moyenne — Université Tunisienne" },
      { name: "description", content: "Calculez votre moyenne semestrielle, crédits ECTS et notes par UE selon le système universitaire tunisien." },
    ],
  }),
});

function Index() {
  const [activeSemester, setActiveSemester] = useState(0);
  const [allGrades, setAllGrades] = useState<Record<string, Record<string, ModuleGrades>>>({});

  const semester = semesters[activeSemester];
  const semesterGrades = allGrades[semester.name] || {};
  const maxCredits = semester.ues.reduce((s, ue) => s + ue.credits, 0);

  const handleGradeChange = useCallback(
    (moduleName: string, field: keyof ModuleGrades, value: string) => {
      setAllGrades((prev) => ({
        ...prev,
        [semester.name]: {
          ...(prev[semester.name] || {}),
          [moduleName]: {
            ...(prev[semester.name]?.[moduleName] || { examen: "", ds: "", cc: "" }),
            [field]: value,
          },
        },
      }));
    },
    [semester.name]
  );

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Header */}
      <header className="pt-10 pb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
        >
          🎓 Calculateur de Moyenne
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground mt-2"
        >
          Système universitaire tunisien — L1 Informatique
        </motion.p>
      </header>

      {/* Semester Toggle */}
      <div className="mb-8">
        <SemesterToggle active={activeSemester} onChange={setActiveSemester} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={semester.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {semester.ues.map((ue, i) => (
                <UECard
                  key={ue.name}
                  ue={ue}
                  index={i}
                  grades={semesterGrades}
                  onGradeChange={handleGradeChange}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Results */}
        <div className="lg:w-80 shrink-0">
          <ResultsPanel
            ues={semester.ues}
            grades={semesterGrades}
            maxCredits={maxCredits}
          />
        </div>
      </div>
    </div>
  );
}
