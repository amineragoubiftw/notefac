export type ExamType = "examen" | "ds" | "cc";

export interface ModuleDef {
  name: string;
  coef: number;
  credits?: number;
  examTypes?: ExamType[]; // default: ["examen","ds","cc"]
}

export interface UEDef {
  name: string;
  coef: number;
  credits: number;
  modules: ModuleDef[];
}

export interface SemesterDef {
  name: string;
  ues: UEDef[];
}

export interface MajorDef {
  id: string;
  name: string;
  semesters: SemesterDef[];
}

export interface InstituteDef {
  id: string;
  name: string;
  majors: MajorDef[];
}

export interface UniversityDef {
  id: string;
  name: string;
  institutes: InstituteDef[];
}

// Default exam mix (Examen 70 / DS 20 / CC 10)
const FULL: ExamType[] = ["examen", "ds", "cc"];
const EXAM_DS: ExamType[] = ["examen", "ds"];

export const universities: UniversityDef[] = [
  {
    id: "uk",
    name: "Université de Kairouan",
    institutes: [
      {
        id: "isigk",
        name: "ISIG Kairouan",
        majors: [
          {
            id: "si-l1",
            name: "Sciences de l'Informatique — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Multimédia & Logique", coef: 3, credits: 6,
                    modules: [
                      { name: "Technologies multimédias", coef: 1.5, examTypes: FULL },
                      { name: "Logique formelle", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algorithmique", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Algorithmique", coef: 2, examTypes: FULL },
                      { name: "Atelier programmation 1", coef: 1.5, examTypes: EXAM_DS },
                    ],
                  },
                  {
                    name: "UE3 — Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Système d'exploitation 1", coef: 1.5, examTypes: FULL },
                      { name: "Architecture des ordinateurs", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Mathématiques", coef: 3, credits: 6,
                    modules: [
                      { name: "Analyse 1", coef: 1.5, examTypes: FULL },
                      { name: "Algèbre 1", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Communication 1", coef: 1, examTypes: EXAM_DS },
                      { name: "Anglais 1", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Maths 2", coef: 3, credits: 6,
                    modules: [
                      { name: "Analyse 2", coef: 1.5, examTypes: FULL },
                      { name: "Algèbre 2", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — BD", coef: 2, credits: 4,
                    modules: [{ name: "Bases de données", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Réseaux & Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Réseaux", coef: 2, examTypes: FULL },
                      { name: "Système d'exploitation 2", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Programmation", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Python", coef: 1, examTypes: EXAM_DS },
                      { name: "Algorithme", coef: 1.5, examTypes: FULL },
                      { name: "Atelier programmation 2", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 3, credits: 6,
                    modules: [
                      { name: "Communication 2", coef: 1, examTypes: EXAM_DS },
                      { name: "Anglais 2", coef: 1, examTypes: EXAM_DS },
                      { name: "Culture", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "utm",
    name: "Université de Tunis El Manar",
    institutes: [
      {
        id: "fst",
        name: "FST — Faculté des Sciences de Tunis",
        majors: [
          {
            id: "math-l1",
            name: "Mathématiques — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Analyse", coef: 4, credits: 8,
                    modules: [
                      { name: "Analyse 1", coef: 2, examTypes: FULL },
                      { name: "Topologie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algèbre", coef: 4, credits: 8,
                    modules: [
                      { name: "Algèbre linéaire 1", coef: 2, examTypes: FULL },
                      { name: "Arithmétique", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE3 — Physique", coef: 3, credits: 6,
                    modules: [
                      { name: "Mécanique", coef: 1.5, examTypes: FULL },
                      { name: "Électricité", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Informatique", coef: 2, credits: 4,
                    modules: [{ name: "Programmation C", coef: 2, examTypes: EXAM_DS }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: EXAM_DS },
                      { name: "Français", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Analyse 2", coef: 4, credits: 8,
                    modules: [
                      { name: "Analyse 2", coef: 2, examTypes: FULL },
                      { name: "Suites & séries", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algèbre 2", coef: 4, credits: 8,
                    modules: [
                      { name: "Algèbre linéaire 2", coef: 2, examTypes: FULL },
                      { name: "Géométrie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE3 — Probabilités", coef: 3, credits: 6,
                    modules: [{ name: "Probabilités", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Statistiques", coef: 2, credits: 4,
                    modules: [{ name: "Statistiques descriptives", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais 2", coef: 1, examTypes: EXAM_DS },
                      { name: "Culture & entrepreneuriat", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "us",
    name: "Université de Sfax",
    institutes: [
      {
        id: "fseg",
        name: "FSEG Sfax",
        majors: [
          {
            id: "gestion-l1",
            name: "Sciences de Gestion — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Économie", coef: 4, credits: 8,
                    modules: [
                      { name: "Microéconomie", coef: 2, examTypes: FULL },
                      { name: "Macroéconomie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité", coef: 4, credits: 8,
                    modules: [{ name: "Comptabilité financière 1", coef: 4, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Maths & Stats", coef: 3, credits: 6,
                    modules: [
                      { name: "Mathématiques", coef: 1.5, examTypes: FULL },
                      { name: "Statistiques", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Droit", coef: 2, credits: 4,
                    modules: [{ name: "Introduction au droit", coef: 2, examTypes: EXAM_DS }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: EXAM_DS },
                      { name: "Communication", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Gestion", coef: 4, credits: 8,
                    modules: [
                      { name: "Introduction à la gestion", coef: 2, examTypes: FULL },
                      { name: "Marketing fondamental", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité 2", coef: 4, credits: 8,
                    modules: [{ name: "Comptabilité financière 2", coef: 4, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Maths financières", coef: 3, credits: 6,
                    modules: [{ name: "Mathématiques financières", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Informatique", coef: 2, credits: 4,
                    modules: [{ name: "Bureautique & TIC", coef: 2, examTypes: EXAM_DS }],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais des affaires", coef: 1, examTypes: EXAM_DS },
                      { name: "Techniques d'expression", coef: 1, examTypes: EXAM_DS },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export type ModuleGrades = { examen: string; ds: string; cc: string };

export function clamp(v: number): number {
  return Math.min(20, Math.max(0, v));
}

const WEIGHTS: Record<ExamType, number> = { examen: 0.7, ds: 0.2, cc: 0.1 };

export function moduleFinalNote(g: ModuleGrades, examTypes: ExamType[] = ["examen", "ds", "cc"]): number | null {
  const parsed: Partial<Record<ExamType, number>> = {};
  let any = false;
  for (const t of examTypes) {
    const v = parseFloat(g[t]);
    if (!isNaN(v)) {
      parsed[t] = clamp(v);
      any = true;
    }
  }
  if (!any) return null;
  const totalWeight = examTypes.reduce((s, t) => s + WEIGHTS[t], 0);
  let sum = 0;
  for (const t of examTypes) {
    const v = parsed[t] ?? 0;
    sum += v * WEIGHTS[t];
  }
  return sum / totalWeight;
}

export function ueAverage(ue: UEDef, grades: Record<string, ModuleGrades>): number | null {
  let w = 0, c = 0, any = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleFinalNote(g, m.examTypes ?? ["examen", "ds", "cc"]);
    if (n === null) continue;
    any = true;
    w += n * m.coef;
    c += m.coef;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function semesterAverage(ues: UEDef[], grades: Record<string, ModuleGrades>): number | null {
  let w = 0, c = 0, any = false;
  for (const ue of ues) {
    const a = ueAverage(ue, grades);
    if (a === null) continue;
    any = true;
    w += a * ue.coef;
    c += ue.coef;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function totalCredits(ues: UEDef[], grades: Record<string, ModuleGrades>): number {
  let credits = 0;
  for (const ue of ues) {
    const a = ueAverage(ue, grades);
    if (a !== null && a >= 10) credits += ue.credits;
  }
  return credits;
}
