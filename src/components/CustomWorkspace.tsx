import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Layers3, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { VideoBackground } from "@/components/VideoBackground";
import { assessments, newModule, newUE, semesterData, validWeights, type CustomWorkspace as Workspace, type CustomModule } from "@/lib/custom-workspace";
import { clamp, moduleComputedNote, round2, semesterAverage, totalCredits, ueAverage } from "@/lib/lmd-data";

const STORAGE_KEY = "notefac:custom-workspace:v1";
const labels = { examen: "Examen", ds: "DS", cc: "CC" };

function NumberField({ label, value, onChange, max, min = 0 }: { label: string; value: number | string; onChange: (value: string) => void; max?: number; min?: number }) {
  return <label className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">
    {label}
    <input aria-label={label} type="number" inputMode="decimal" min={min} max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} onWheel={(event) => event.currentTarget.blur()} className="glass-input w-full min-w-0 tabular-nums" />
  </label>;
}
function amount(value: string, max = Infinity) { return Math.max(0, Math.min(max, Number(value) || 0)); }
function Score({ value }: { value: number | null }) {
  return <span className={`text-xl font-bold tabular-nums ${value === null ? "text-muted-foreground" : round2(value) >= 10 ? "text-success" : "text-danger"}`}>{value === null ? "--" : round2(value).toFixed(2)}</span>;
}

export function CustomWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>({ semesters: [] });
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [selected, setSelected] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ title: string; action: () => void } | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Workspace = JSON.parse(saved);
        if (!Array.isArray(parsed.semesters)) throw new Error("Invalid workspace");
        setWorkspace(parsed);
      }
    } catch { setStorageError("Les données enregistrées n’ont pas pu être restaurées."); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace)); setStorageError(""); }
    catch { setStorageError("Enregistrement impossible sur cet appareil. Vos modifications ne sont pas sauvegardées."); }
  }, [workspace, loaded]);

  const semester = workspace.semesters.find((item) => item.id === selected) ?? workspace.semesters[0];
  const data = useMemo(() => semester ? semesterData(semester) : null, [semester]);
  const configurationValid = Boolean(data?.valid && semester?.ues.every((ue) => ue.coef > 0 && ue.modules.every((module) => module.coef > 0)));
  const avg = data && configurationValid ? semesterAverage(data.ues, data.grades) : null;
  const earned = data && configurationValid ? totalCredits(data.ues, data.grades) : 0;
  const credits = semester?.ues.reduce((sum, ue) => sum + ue.credits, 0) ?? 0;
  function updateSemester(transform: (current: NonNullable<typeof semester>) => NonNullable<typeof semester>) {
    if (!semester) return;
    setWorkspace((current) => ({ semesters: current.semesters.map((item) => item.id === semester.id ? transform(item) : item) }));
  }
  function updateModule(ueId: string, moduleId: string, patch: Partial<CustomModule>) {
    updateSemester((current) => ({ ...current, ues: current.ues.map((ue) => ue.id === ueId ? { ...ue, modules: ue.modules.map((module) => module.id === moduleId ? { ...module, ...patch } : module) } : ue) }));
  }
  function addSemester() {
    const id = crypto.randomUUID();
    setWorkspace((current) => ({ semesters: [...current.semesters, { id, name: `Semestre ${current.semesters.length + 1}`, ues: [] }] }));
    setSelected(id);
  }

  return <main className="relative min-h-screen mesh-gradient px-4 pb-16 pt-8 text-foreground">
    <VideoBackground />
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/"><ArrowLeft />Calculateur principal</Link></Button>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold"><SlidersHorizontal className="size-7 text-primary" />Mode personnalisé</h1>
        </div>
        <span role="status" className={`flex items-center gap-2 text-xs ${storageError ? "text-danger" : "text-muted-foreground"}`}><Check className="size-4" />{storageError || (loaded ? "Enregistré sur cet appareil" : "Chargement…")}</span>
      </header>
      <nav aria-label="Semestres personnalisés" className="mb-6 flex flex-wrap gap-2">
        {workspace.semesters.map((item) => <Button key={item.id} variant={semester?.id === item.id ? "default" : "outline"} onClick={() => setSelected(item.id)} aria-pressed={semester?.id === item.id} className="max-w-full whitespace-normal break-words">{item.name || "Sans nom"}</Button>)}
        <Button variant="outline" onClick={addSemester} disabled={!loaded}><Plus />Ajouter un semestre</Button>
      </nav>
      {!semester ? <div className="border-y border-glass-border py-20 text-center">
        <Layers3 className="mx-auto mb-4 size-12 text-primary" />
        <h2 className="mb-6 text-xl font-semibold">Votre espace personnalisé</h2>
        <Button onClick={addSemester} disabled={!loaded}><Plus />Créer mon premier semestre</Button>
      </div> : <>
        <div className="mb-6 flex flex-wrap items-end gap-3 border-b border-glass-border pb-5">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-muted-foreground">Nom du semestre<input aria-label="Nom du semestre" className="glass-input w-full" value={semester.name} onChange={(event) => updateSemester((current) => ({ ...current, name: event.target.value }))} /></label>
          <Button variant="outline" onClick={() => updateSemester((current) => ({ ...current, ues: [...current.ues, newUE()] }))}><Plus />Ajouter une UE</Button>
          <Button variant="ghost" size="icon" title="Supprimer le semestre" aria-label="Supprimer le semestre" onClick={() => setPendingDelete({ title: semester.name, action: () => setWorkspace((current) => ({ semesters: current.semesters.filter((item) => item.id !== semester.id) })) })}><Trash2 className="text-danger" /></Button>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-8">
            {semester.ues.length === 0 && <p className="py-12 text-center text-muted-foreground">Aucune UE</p>}
            {semester.ues.map((ue, ueIndex) => {
              const definition = data?.ues[ueIndex];
              const ueValid = ue.coef > 0 && ue.modules.every((module) => validWeights(module) && module.coef > 0);
              const note = definition && data && ueValid ? ueAverage(definition, data.grades) : null;
              return <section key={ue.id} className="min-w-0 border-b border-glass-border pb-6" aria-label={ue.name}>
                <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <label className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">Nom de l’UE<input aria-label="Nom de l’UE" className="glass-input w-full font-semibold" value={ue.name} onChange={(event) => updateSemester((current) => ({ ...current, ues: current.ues.map((item) => item.id === ue.id ? { ...item, name: event.target.value } : item) }))} /></label>
                  <div className="flex items-end gap-2"><Score value={note} /><Button variant="ghost" size="icon" aria-label="Supprimer l’UE" title="Supprimer l’UE" onClick={() => setPendingDelete({ title: ue.name, action: () => updateSemester((current) => ({ ...current, ues: current.ues.filter((item) => item.id !== ue.id) })) })}><Trash2 className="text-danger" /></Button></div>
                </div>
                <div className="mb-5 grid max-w-sm grid-cols-2 gap-3">
                  <NumberField label="Coef UE" value={ue.coef} onChange={(value) => updateSemester((current) => ({ ...current, ues: current.ues.map((item) => item.id === ue.id ? { ...item, coef: amount(value) } : item) }))} />
                  <NumberField label="Crédits UE" value={ue.credits} onChange={(value) => updateSemester((current) => ({ ...current, ues: current.ues.map((item) => item.id === ue.id ? { ...item, credits: amount(value) } : item) }))} />
                </div>
                <div className="space-y-3">
                  {ue.modules.map((module) => <article key={module.id} className="glass-card rounded-lg p-4" aria-label={module.name}>
                    <div className="mb-4 flex items-center gap-2"><label className="min-w-0 flex-1 text-xs text-muted-foreground">Nom du module<input aria-label="Nom du module" className="glass-input mt-1 w-full font-medium" value={module.name} onChange={(event) => updateModule(ue.id, module.id, { name: event.target.value })} /></label><Button variant="ghost" size="icon" aria-label="Supprimer le module" title="Supprimer le module" onClick={() => setPendingDelete({ title: module.name, action: () => updateSemester((current) => ({ ...current, ues: current.ues.map((item) => item.id === ue.id ? { ...item, modules: item.modules.filter((entry) => entry.id !== module.id) } : item) })) })}><Trash2 className="text-danger" /></Button></div>
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      <NumberField label="Coef module" value={module.coef} onChange={(value) => updateModule(ue.id, module.id, { coef: amount(value) })} />
                      <NumberField label="Crédits module" value={module.credits} onChange={(value) => updateModule(ue.id, module.id, { credits: amount(value) })} />
                      <label className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">Rg<input aria-label="Rg" value={module.rg} onChange={(event) => updateModule(ue.id, module.id, { rg: event.target.value })} className="glass-input w-full" /></label>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {assessments.map((field) => <NumberField key={field} label={`Poids ${labels[field]} (%)`} value={module.weights[field]} max={100} onChange={(value) => updateModule(ue.id, module.id, { weights: { ...module.weights, [field]: amount(value, 100) } })} />)}
                    </div>
                    {!validWeights(module) && <p role="alert" className="mt-2 text-xs text-danger">Le total des poids doit être égal à 100 %.</p>}
                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-glass-border pt-4">
                      {assessments.map((field) => <NumberField key={field} label={`${labels[field]} /20`} value={module.grades[field] ?? ""} max={20} onChange={(value) => updateModule(ue.id, module.id, { grades: { ...module.grades, [field]: value === "" ? "" : String(clamp(Number(value))) } })} />)}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Moyenne module</span><Score value={validWeights(module) ? moduleComputedNote(module.grades, [...assessments], undefined, module.weights) : null} /></div>
                  </article>)}
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => updateSemester((current) => ({ ...current, ues: current.ues.map((item) => item.id === ue.id ? { ...item, modules: [...item.modules, newModule()] } : item) }))}><Plus />Ajouter un module</Button>
              </section>;
            })}
          </div>
          <aside aria-label="Résultats personnalisés" className="sticky top-6 border-t border-glass-border py-6">
            <h2 className="mb-6 text-lg font-bold">Résultats</h2>
            {!configurationValid && <p role="alert" className="mb-4 text-sm text-danger">Les coefficients doivent être positifs et les poids totaliser 100 %.</p>}
            <p className="mb-2 text-xs text-muted-foreground">Moyenne semestre</p>
            <div data-testid="semester-average" className="mb-6"><Score value={avg} /><span className="ml-2 text-xs text-muted-foreground">/20</span></div>
            <p className="mb-2 text-xs text-muted-foreground">Crédits validés</p>
            <p data-testid="validated-credits" className="mb-6 text-3xl font-bold tabular-nums">{earned}<span className="text-lg font-normal text-muted-foreground"> / {credits}</span></p>
            <div className="space-y-3">{semester.ues.map((ue, index) => <div key={ue.id} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 break-words">{ue.name || "Sans nom"}</span><Score value={data && configurationValid ? ueAverage(data.ues[index], data.grades) : null} /></div>)}</div>
          </aside>
        </div>
      </>}
    </div>
    <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <AlertDialogHeader><AlertDialogTitle>Supprimer « {pendingDelete?.title} » ?</AlertDialogTitle><AlertDialogDescription>Les éléments et notes associés seront supprimés. Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { pendingDelete?.action(); setPendingDelete(null); }} className="bg-danger text-destructive-foreground hover:bg-danger/90">Supprimer</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </main>;
}