import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, Sparkles } from "lucide-react";
import { universities, semesterAverage, totalCredits, type ModuleGrades } from "@/lib/lmd-data";
import { SelectionBar } from "@/components/SelectionBar";
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
      { title: "Calculateur LMD Tunisien — Moyennes & Crédits" },
      { name: "description", content: "Calculateur universel de moyennes et crédits pour le système LMD tunisien. Sélectionnez votre université, institut et parcours." },
    ],
  }),
});

const PROFILE_KEY = "lmd-calc:profile:v1";
const GRADES_KEY = "lmd-calc:grades:v1";

interface Profile {
  universityId: string;
  instituteId: string;
  majorId: string;
}

// grades scoped: majorId -> semesterName -> moduleName -> ModuleGrades
type AllGrades = Record<string, Record<string, Record<string, ModuleGrades>>>;

function Index() {
  const [profile, setProfile] = useLocalStorage<Profile>(PROFILE_KEY, {
    universityId: "",
    instituteId: "",
    majorId: "",
  });
  const [allGrades, setAllGrades, savedTick] = useLocalStorage<AllGrades>(GRADES_KEY, {});
  const [activeSemester, setActiveSemester] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  const major = useMemo(() => {
    const u = universities.find((x) => x.id === profile.universityId);
    const i = u?.institutes.find((x) => x.id === profile.instituteId);
    return i?.majors.find((x) => x.id === profile.majorId);
  }, [profile]);

  const semester = major?.semesters[activeSemester];
  const semesterGrades =
    (major && semester && allGrades[major.id]?.[semester.name]) || {};
  const maxCredits = semester?.ues.reduce((s, ue) => s + ue.credits, 0) ?? 0;

  useEffect(() => {
    if (savedTick === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 1500);
    return () => clearTimeout(t);
  }, [savedTick]);

  useEffect(() => {
    setActiveSemester(0);
  }, [profile.majorId]);

  const handleSelectionChange = useCallback(
    (sel: Profile) => setProfile(() => sel),
    [setProfile]
  );

  const handleGradeChange = useCallback(
    (moduleName: string, field: keyof ModuleGrades, value: string) => {
      if (!major || !semester) return;
      setAllGrades((prev) => {
        const majorGrades = prev[major.id] || {};
        const semGrades = majorGrades[semester.name] || {};
        const moduleGrades: ModuleGrades = semGrades[moduleName] || {};
        return {
          ...prev,
          [major.id]: {
            ...majorGrades,
            [semester.name]: {
              ...semGrades,
              [moduleName]: { ...moduleGrades, [field]: value },
            },
          },
        };
      });
    },
    [major, semester, setAllGrades]
  );

  const handleClearAll = useCallback(() => {
    setAllGrades(() => ({}));
    setProfile(() => ({ universityId: "", instituteId: "", majorId: "" }));
  }, [setAllGrades, setProfile]);

  return (
    <div className="min-h-screen mesh-gradient">
      <header className="pt-10 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
        >
          🎓 Calculateur LMD Tunisien
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground mt-2"
        >
          Universités · Établissements · Parcours · Moyennes & Crédits
        </motion.p>

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
                <span>Reset My Data</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-glass-border bg-transparent backdrop-blur-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will erase your saved profile and all grades. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="glass-card border-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-danger text-white hover:bg-danger/90"
                >
                  Reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Selection */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <SelectionBar
          universityId={profile.universityId}
          instituteId={profile.instituteId}
          majorId={profile.majorId}
          onChange={handleSelectionChange}
        />
      </div>

      {/* Semester toggle + content */}
      {major ? (
        <>
          <div className="my-8">
            <SemesterToggle
              semesters={major.semesters.map((s) => s.name)}
              active={activeSemester}
              onChange={setActiveSemester}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${major.id}-${semester?.name}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {semester?.ues.map((ue, i) => (
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
            <div className="lg:w-80 shrink-0">
              {semester && (
                <ResultsPanel
                  ues={semester.ues}
                  grades={semesterGrades}
                  maxCredits={maxCredits}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto px-4 mt-10 text-center"
        >
          <div className="glass-card p-10">
            <Sparkles className="w-10 h-10 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Commencez par sélectionner votre parcours
            </h2>
            <p className="text-sm text-muted-foreground">
              Choisissez votre université, votre établissement et votre spécialité
              ci-dessus pour générer automatiquement le formulaire de notes.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
