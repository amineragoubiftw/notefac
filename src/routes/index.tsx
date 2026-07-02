import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, Sparkles } from "lucide-react";
import { universities, type ModuleGrades, type MajorDef, generalAverage, generalCredits, hasAnyControl } from "@/lib/lmd-data";
import { SelectionBar } from "@/components/SelectionBar";
import { SemesterToggle } from "@/components/SemesterToggle";
import { UECard } from "@/components/UECard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { VideoBackground } from "@/components/VideoBackground";
import { ShareControls, mergeYearGrades } from "@/components/ShareControls";
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
  const majorGrades = (major && allGrades[major.id]) || {};
  const semesterGrades =
    (semester && majorGrades[semester.name]) || {};
  const anyControlAll = useMemo(() => hasAnyControl(majorGrades), [majorGrades]);
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

  // Auto-import from share link: /?import=CODE
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("import");
    if (!code) return;
    // Clear the param so it doesn't re-import on refresh
    const url = new URL(window.location.href);
    url.searchParams.delete("import");
    window.history.replaceState({}, "", url.toString());

    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("year_shares")
        .select("payload, major_id, major_name")
        .eq("share_code", code.toUpperCase())
        .maybeSingle();
      if (!data) return;
      // Locate the major across universities to also set profile if empty
      for (const u of universities) {
        for (const i of u.institutes) {
          const m = i.majors.find((x) => x.id === data.major_id);
          if (m) {
            setProfile((p) =>
              p.majorId === m.id
                ? p
                : { universityId: u.id, instituteId: i.id, majorId: m.id },
            );
            setAllGrades((prev) => ({
              ...prev,
              [m.id]: mergeYearGrades(
                prev[m.id] || {},
                data.payload as Record<string, Record<string, ModuleGrades>>,
              ),
            }));
            return;
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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

  const handleImportYear = useCallback(
    (
      imported: Record<string, Record<string, ModuleGrades>>,
      majorId: string,
      _majorName: string | null,
    ) => {
      // Auto-select the correct profile (university + institute + major) so
      // the recipient sees the imported semesters immediately, even when they
      // had no selection before.
      let found: { universityId: string; instituteId: string; majorId: string } | null = null;
      for (const u of universities) {
        for (const i of u.institutes) {
          if (i.majors.some((m) => m.id === majorId)) {
            found = { universityId: u.id, instituteId: i.id, majorId };
            break;
          }
        }
        if (found) break;
      }
      if (found) {
        setProfile((p) => (p.majorId === majorId ? p : (found as Profile)));
      }
      setAllGrades((prev) => ({
        ...prev,
        [majorId]: mergeYearGrades(prev[majorId] || {}, imported),
      }));
    },
    [setAllGrades, setProfile],
  );

  return (
    <div className="min-h-screen mesh-gradient relative">
      <VideoBackground />
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

        <div className="max-w-7xl mx-auto px-4 mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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

          <ShareControls
            major={major}
            yearGrades={(major && allGrades[major.id]) || {}}
            onImport={handleImportYear}
          />



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
                      extraControl={anyControlAll}
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
                  extraControl={anyControlAll}
                />
              )}
            </div>
          </div>

          {major && <GeneralSummary major={major} gradesByMajor={allGrades[major.id] || {}} />}
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

function GeneralSummary({
  major,
  gradesByMajor,
}: {
  major: MajorDef;
  gradesByMajor: Record<string, Record<string, ModuleGrades>>;
}) {
  const avg = generalAverage(major, gradesByMajor);
  const { earned, max } = generalCredits(major, gradesByMajor);
  const pct = max ? (earned / max) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 pb-16"
    >
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <h2 className="text-lg md:text-xl font-bold text-foreground break-words min-w-0">
            🏆 Résultats Généraux — {major.name}
          </h2>
          <span className="text-xs text-muted-foreground shrink-0">
            Tous les semestres
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Moyenne Générale
            </p>
            <p
              className={`text-5xl md:text-6xl font-extrabold tabular-nums ${
                avg !== null
                  ? avg >= 10
                    ? "text-success glow-text"
                    : "text-danger"
                  : "text-muted-foreground"
              }`}
              style={
                avg !== null && avg >= 10
                  ? ({ "--glow": "var(--success)" } as React.CSSProperties)
                  : undefined
              }
            >
              {avg !== null ? avg.toFixed(2) : "--"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">/20</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Crédits Totaux
            </p>
            <p className="text-5xl md:text-6xl font-extrabold tabular-nums text-foreground">
              {earned}
              <span className="text-2xl text-muted-foreground font-normal">
                /{max}
              </span>
            </p>
            <div className="mt-3 h-2 rounded-full bg-glass overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
