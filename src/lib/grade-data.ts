export interface Module {
  name: string;
  coef: number;
}

export interface UE {
  name: string;
  coef: number;
  credits: number;
  modules: Module[];
}

export interface Semester {
  name: string;
  ues: UE[];
}

export const semesters: Semester[] = [
  {
    name: "Semestre 1",
    ues: [
      {
        name: "UE1", coef: 3, credits: 6,
        modules: [
          { name: "Technologies multimedias", coef: 1.5 },
          { name: "Logique formelle", coef: 1.5 },
        ],
      },
      {
        name: "UE2", coef: 3.5, credits: 7,
        modules: [
          { name: "Algorithmique", coef: 2 },
          { name: "Atelier programmation 1", coef: 1.5 },
        ],
      },
      {
        name: "UE3", coef: 3.5, credits: 7,
        modules: [
          { name: "Systeme exploitation 1", coef: 1.5 },
          { name: "Architecture ordinateurs", coef: 2 },
        ],
      },
      {
        name: "UE4", coef: 3, credits: 6,
        modules: [
          { name: "Analyse 1", coef: 1.5 },
          { name: "Algebre 1", coef: 1.5 },
        ],
      },
      {
        name: "UE5", coef: 2, credits: 4,
        modules: [
          { name: "Communication 1", coef: 1 },
          { name: "Anglais 1", coef: 1 },
        ],
      },
    ],
  },
  {
    name: "Semestre 2",
    ues: [
      {
        name: "UE1", coef: 3, credits: 6,
        modules: [
          { name: "Analyse 2", coef: 1.5 },
          { name: "Algebre 2", coef: 1.5 },
        ],
      },
      {
        name: "UE2", coef: 2, credits: 4,
        modules: [
          { name: "Base de donnees", coef: 2 },
        ],
      },
      {
        name: "UE3", coef: 3.5, credits: 7,
        modules: [
          { name: "Reseaux", coef: 2 },
          { name: "Systeme exploitation 2", coef: 1.5 },
        ],
      },
      {
        name: "UE4", coef: 3.5, credits: 7,
        modules: [
          { name: "Python", coef: 1 },
          { name: "Algorithme", coef: 1.5 },
          { name: "Atelier programmation 2", coef: 1 },
        ],
      },
      {
        name: "UE5", coef: 3, credits: 6,
        modules: [
          { name: "Communication 2", coef: 1 },
          { name: "Anglais 2", coef: 1 },
          { name: "Culture", coef: 1 },
        ],
      },
    ],
  },
];

export type ModuleGrades = { examen: string; ds: string; cc: string };

export function clamp(v: number): number {
  return Math.min(20, Math.max(0, v));
}

export function moduleFinalNote(g: ModuleGrades): number | null {
  const e = parseFloat(g.examen);
  const d = parseFloat(g.ds);
  const c = parseFloat(g.cc);
  if (isNaN(e) && isNaN(d) && isNaN(c)) return null;
  const ex = isNaN(e) ? 0 : clamp(e);
  const ds = isNaN(d) ? 0 : clamp(d);
  const cc = isNaN(c) ? 0 : clamp(c);
  return 0.7 * ex + 0.2 * ds + 0.1 * cc;
}

export function ueAverage(
  modules: Module[],
  grades: Record<string, ModuleGrades>
): number | null {
  let sumWeighted = 0;
  let sumCoef = 0;
  let hasAny = false;
  for (const mod of modules) {
    const g = grades[mod.name];
    if (!g) continue;
    const note = moduleFinalNote(g);
    if (note === null) continue;
    hasAny = true;
    sumWeighted += note * mod.coef;
    sumCoef += mod.coef;
  }
  if (!hasAny || sumCoef === 0) return null;
  return sumWeighted / sumCoef;
}

export function semesterAverage(
  ues: UE[],
  grades: Record<string, ModuleGrades>
): number | null {
  let sumWeighted = 0;
  let sumCoef = 0;
  let hasAny = false;
  for (const ue of ues) {
    const avg = ueAverage(ue.modules, grades);
    if (avg === null) continue;
    hasAny = true;
    sumWeighted += avg * ue.coef;
    sumCoef += ue.coef;
  }
  if (!hasAny || sumCoef === 0) return null;
  return sumWeighted / sumCoef;
}

export function totalCredits(
  ues: UE[],
  grades: Record<string, ModuleGrades>
): number {
  let credits = 0;
  for (const ue of ues) {
    const avg = ueAverage(ue.modules, grades);
    if (avg !== null && avg >= 10) credits += ue.credits;
  }
  return credits;
}
