import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check } from "lucide-react";
import { semesters, type ModuleGrades } from "@/lib/grade-data";
import { SemesterToggle } from "@/components/SemesterToggle";
import { UECard } from "@/components/UECard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Calculateur de Moyenne — Université Tunisienne" },
      { name: "description", content: "Calculez votre moyenne semestrielle, crédits ECTS et notes par UE selon le système universitaire tunisien." },
    ],
  }),
});

const STORAGE_KEY = "grade-calc:all-grades:v1";

function Index() {
  const [activeSemester, setActiveSemester] = useState(0);
  const [allGrades, setAllGrades, savedTick] = useLocalStorage<
    Record<string, Record<string, ModuleGrades>>
  >(STORAGE_KEY, {});
  const [showSaved, setShowSaved] = useState(false);

  const semester = semesters[activeSemester];
  const semesterGrades = allGrades[semester.name] || {};
  const maxCredits = semester.ues.reduce((s, ue) => s + ue.credits, 0);

  useEffect(() => {
    if (savedTick === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 1500);
    return () => clearTimeout(t);
  }, [savedTick]);

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
    [semester.name, setAllGrades]
  );

  const handleClearAll = useCallback(() => {
    setAllGrades({});
  }, [setAllGrades]);

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Header */}
      <header className="pt-10 pb-6 text-center relative">
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

        {/* Auto-save indicator + Reset button row */}
        <div className="max-w-7xl mx-auto px-4 mt-5 flex items-center justify-center gap-3">
          <AnimatePresence>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs text-success"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Auto-saved</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground hover:text-danger transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-glass-border bg-transparent backdrop-blur-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Are you sure you want to delete all saved grades? This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="glass-card border-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-danger text-white hover:bg-danger/90"
                >
                  Delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
