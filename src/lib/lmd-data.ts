export type ExamType = "examen" | "ds" | "cc" | "ds1" | "ds2" | "control";

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
const TRANS: ExamType[] = ["ds1", "ds2", "cc"];
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
            id: "se-l1",
            name: "Sciences Économiques — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Initiation à l'économie", coef: 2.5, credits: 5,
                    modules: [{ name: "Initiation à l'économie", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE2 — Initiation à la gestion", coef: 2.5, credits: 5,
                    modules: [{ name: "Initiation à la gestion", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Comptabilité", coef: 2.5, credits: 5,
                    modules: [{ name: "Comptabilité", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Mathématiques (Analyse)", coef: 2.5, credits: 5,
                    modules: [{ name: "Mathématiques (Analyse)", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Statistique descriptive et calcul des probabilités", coef: 2.5, credits: 5,
                    modules: [{ name: "Statistique descriptive et calcul des probabilités", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE6 — Unité transversale", coef: 2.5, credits: 5,
                    modules: [
                      { name: "Langue étrangère 1", coef: 0.75, examTypes: TRANS },
                      { name: "Langue étrangère 2", coef: 0.75, examTypes: TRANS },
                      { name: "Compétences digitales", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Microéconomie", coef: 3, credits: 6,
                    modules: [{ name: "Microéconomie", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE2 — Macroéconomie", coef: 2.5, credits: 5,
                    modules: [{ name: "Macroéconomie", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Comptabilité financière 2", coef: 2.5, credits: 5,
                    modules: [{ name: "Comptabilité financière 2", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Mathématiques (Algèbre)", coef: 2.5, credits: 5,
                    modules: [{ name: "Mathématiques (Algèbre)", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Principes de droit", coef: 2, credits: 4,
                    modules: [{ name: "Principes de droit", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE6 — Unité transversale", coef: 2.5, credits: 5,
                    modules: [
                      { name: "Langue étrangère 2", coef: 0.75, examTypes: TRANS },
                      { name: "Langue étrangère 1", coef: 0.75, examTypes: TRANS },
                      { name: "Compétences digitales", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
            ],
          },
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
                      { name: "Atelier programmation 1", coef: 1.5, examTypes: FULL },
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
                      { name: "Communication 1", coef: 1, examTypes: TRANS },
                      { name: "Anglais 1", coef: 1, examTypes: TRANS },
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
                      { name: "Python", coef: 1, examTypes: FULL },
                      { name: "Algorithme", coef: 1.5, examTypes: FULL },
                      { name: "Atelier programmation 2", coef: 1, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 3, credits: 6,
                    modules: [
                      { name: "Communication 2", coef: 1, examTypes: TRANS },
                      { name: "Anglais 2", coef: 1, examTypes: TRANS },
                      { name: "Culture", coef: 1, examTypes: TRANS },
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
                    modules: [{ name: "Programmation C", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: FULL },
                      { name: "Français", coef: 1, examTypes: FULL },
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
                      { name: "Anglais 2", coef: 1, examTypes: TRANS },
                      { name: "Culture & entrepreneuriat", coef: 1, examTypes: TRANS },
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
                    modules: [{ name: "Introduction au droit", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: FULL },
                      { name: "Communication", coef: 1, examTypes: FULL },
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
                    modules: [{ name: "Bureautique & TIC", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais des affaires", coef: 1, examTypes: TRANS },
                      { name: "Techniques d'expression", coef: 1, examTypes: TRANS },
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

export type ModuleGrades = Partial<Record<ExamType, string>>;

export function clamp(v: number): number {
  return Math.min(20, Math.max(0, v));
}

// Parse a grade string, tolerating French-style "9,5" alongside "9.5".
// Trailing/leading spaces are ignored. Returns NaN when no number is present
// (matches parseFloat semantics so callers' isNaN checks keep working).
function parseGrade(s: string | undefined | null): number {
  if (s == null) return NaN;
  return parseFloat(String(s).replace(",", ".").trim());
}

// Round to 2 decimals using a small epsilon to defeat IEEE-754 drift
// (e.g. 9.995 should round to 10.00, not 9.99). This is what the UI shows,
// so credit / validation decisions must use the same rounded value or a
// displayed 10.00 can end up flagged as a fail.
export function round2(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

const WEIGHTS_FULL: Partial<Record<ExamType, number>> = { examen: 0.7, ds: 0.2, cc: 0.1 };
const WEIGHTS_TRANS: Partial<Record<ExamType, number>> = { ds1: 0.4, ds2: 0.4, cc: 0.2 };
const WEIGHTS_EXAM_DS: Partial<Record<ExamType, number>> = { examen: 0.7, ds: 0.3 };

function weightsFor(examTypes: ExamType[]): Partial<Record<ExamType, number>> {
  if (examTypes.includes("ds1") || examTypes.includes("ds2")) return WEIGHTS_TRANS;
  if (!examTypes.includes("cc")) return WEIGHTS_EXAM_DS;
  return WEIGHTS_FULL;
}

export function moduleComputedNote(g: ModuleGrades, examTypes: ExamType[] = ["examen", "ds", "cc"]): number | null {
  const W = weightsFor(examTypes);
  const parsed: Partial<Record<ExamType, number>> = {};
  let any = false;
  for (const t of examTypes) {
    const v = parseFloat(g[t] ?? "");
    if (!isNaN(v)) {
      parsed[t] = clamp(v);
      any = true;
    }
  }
  if (!any) return null;
  const totalWeight = examTypes.reduce((s, t) => s + (W[t] ?? 0), 0);
  let sum = 0;
  for (const t of examTypes) {
    const v = parsed[t] ?? 0;
    sum += v * (W[t] ?? 0);
  }
  return totalWeight ? sum / totalWeight : null;
}

export function moduleFinalNote(
  g: ModuleGrades,
  examTypes: ExamType[] = ["examen", "ds", "cc"],
  forceMax: boolean = false,
): number | null {
  const note = moduleComputedNote(g, examTypes);
  const ctrl = parseFloat(g.control ?? "");
  const ctrlClamped = isNaN(ctrl) ? null : clamp(ctrl);
  // When a control grade is entered (here or in a sibling module of the UE),
  // the module average is the highest of EXAM, computed NOTE, and CONTROL.
  if (ctrlClamped !== null || forceMax) {
    const candidates: number[] = [];
    if (ctrlClamped !== null) candidates.push(ctrlClamped);
    if (note !== null) candidates.push(note);
    const examRaw = parseFloat(g.examen ?? "");
    if (!isNaN(examRaw)) candidates.push(clamp(examRaw));
    return candidates.length ? Math.max(...candidates) : null;
  }
  return note;
}

export function hasAnyControl(
  grades: Record<string, ModuleGrades> | Record<string, Record<string, ModuleGrades>> | undefined,
): boolean {
  if (!grades) return false;
  for (const v of Object.values(grades)) {
    if (!v) continue;
    // Heuristic: ModuleGrades has string values; nested map has object values.
    const first = Object.values(v)[0];
    if (typeof first === "object" && first !== null) {
      if (hasAnyControl(v as Record<string, ModuleGrades>)) return true;
    } else {
      const ctrl = parseFloat((v as ModuleGrades).control ?? "");
      if (!isNaN(ctrl)) return true;
    }
  }
  return false;
}

export function ueAverage(
  ue: UEDef,
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number | null {
  // 1) Principal-only average (no control, no max rule).
  let pw = 0, pc = 0, pAny = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleComputedNote(g, m.examTypes ?? ["examen", "ds", "cc"]);
    if (n === null) continue;
    pAny = true;
    pw += n * m.coef;
    pc += m.coef;
  }
  const principalAvg = pAny && pc > 0 ? pw / pc : null;

  // 2) If the UE is already validated on principal grades (>= 10),
  // the whole UE is acquired — ignore controls entirely.
  if (principalAvg !== null && principalAvg >= 10) return principalAvg;

  // 3) Otherwise, if any module has a control (in this UE, this semester,
  // or anywhere in the whole major via extraControl), apply max(exam, note, control)
  // to every module in the UE.
  const anyControl = extraControl || hasAnyControl(grades);
  let w = 0, c = 0, any = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleFinalNote(g, m.examTypes ?? ["examen", "ds", "cc"], anyControl);
    if (n === null) continue;
    any = true;
    w += n * m.coef;
    c += m.coef;
  }
  if (!any || c === 0) return principalAvg;
  return w / c;
}

export function semesterAverage(
  ues: UEDef[],
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number | null {
  let w = 0, c = 0, any = false;
  for (const ue of ues) {
    const a = ueAverage(ue, grades, extraControl);
    if (a === null) continue;
    any = true;
    w += a * ue.coef;
    c += ue.coef;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function totalCredits(
  ues: UEDef[],
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number {
  let credits = 0;
  for (const ue of ues) {
    const a = ueAverage(ue, grades, extraControl);
    if (a !== null && a >= 10) credits += ue.credits;
  }
  return credits;
}

export function maxCreditsForSemester(ues: UEDef[]): number {
  return ues.reduce((s, ue) => s + ue.credits, 0);
}

export function generalAverage(
  major: MajorDef,
  gradesByMajor: Record<string, Record<string, ModuleGrades>>
): number | null {
  const extra = hasAnyControl(gradesByMajor);
  let w = 0, c = 0, any = false;
  for (const sem of major.semesters) {
    const semGrades = gradesByMajor?.[sem.name] || {};
    const a = semesterAverage(sem.ues, semGrades, extra);
    if (a === null) continue;
    any = true;
    const credits = maxCreditsForSemester(sem.ues);
    w += a * credits;
    c += credits;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function generalCredits(
  major: MajorDef,
  gradesByMajor: Record<string, Record<string, ModuleGrades>>
): { earned: number; max: number } {
  const extra = hasAnyControl(gradesByMajor);
  let earned = 0, max = 0;
  for (const sem of major.semesters) {
    max += maxCreditsForSemester(sem.ues);
    const semGrades = gradesByMajor?.[sem.name] || {};
    earned += totalCredits(sem.ues, semGrades, extra);
  }
  return { earned, max };
}
