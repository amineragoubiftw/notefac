// Universal Tunisian LMD database
// Hierarchy: University -> Établissement -> Major -> Semester -> UE -> Module
// Each module has a regime: "MX" (Examen 70 / DS 20 / CC 10) or "CC" (100% contrôle continu)

export type ExamType = "examen" | "ds" | "cc";
export type Regime = "MX" | "CC";

export interface ModuleDef {
  name: string;
  coef: number;
  credits?: number;
  regime: Regime; // MX = mixte (Examen+DS+CC), CC = contrôle continu pur
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
  city?: string;
  majors: MajorDef[];
}

export interface UniversityDef {
  id: string;
  name: string;
  institutes: InstituteDef[];
}

export const universities: UniversityDef[] = [
  // ===== Université de Kairouan =====
  {
    id: "uk",
    name: "Université de Kairouan",
    institutes: [
      {
        id: "isigk",
        name: "ISIG Kairouan — Institut Supérieur d'Informatique et de Gestion",
        city: "Kairouan",
        majors: [
          {
            id: "isigk-si-l1",
            name: "Licence Sciences de l'Informatique — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Multimédia & Logique", coef: 3, credits: 6,
                    modules: [
                      { name: "Logiciel multimédia", coef: 1.5, regime: "MX" },
                      { name: "Logique formelle", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE2 — Algorithmique", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Algorithmique", coef: 2, regime: "MX" },
                      { name: "Atelier programmation 1", coef: 1.5, regime: "CC" },
                    ],
                  },
                  {
                    name: "UE3 — Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Système d'exploitation 1", coef: 1.5, regime: "MX" },
                      { name: "Architecture des ordinateurs", coef: 2, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Mathématiques", coef: 3, credits: 6,
                    modules: [
                      { name: "Analyse 1", coef: 1.5, regime: "MX" },
                      { name: "Algèbre 1", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Communication 1", coef: 1, regime: "CC" },
                      { name: "Anglais 1", coef: 1, regime: "CC" },
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
                      { name: "Analyse 2", coef: 1.5, regime: "MX" },
                      { name: "Algèbre 2", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE2 — Bases de données", coef: 2, credits: 4,
                    modules: [{ name: "Bases de données", coef: 2, regime: "MX" }],
                  },
                  {
                    name: "UE3 — Réseaux & Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Réseaux", coef: 2, regime: "MX" },
                      { name: "Système d'exploitation 2", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Programmation", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Python", coef: 1, regime: "MX" },
                      { name: "Algorithme", coef: 1.5, regime: "MX" },
                      { name: "Atelier programmation 2", coef: 1, regime: "CC" },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 3, credits: 6,
                    modules: [
                      { name: "Communication 2", coef: 1, regime: "CC" },
                      { name: "Anglais 2", coef: 1, regime: "CC" },
                      { name: "Culture & entrepreneuriat", coef: 1, regime: "CC" },
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

  // ===== Université de Sousse =====
  {
    id: "uso",
    name: "Université de Sousse",
    institutes: [
      {
        id: "fdsep-sousse",
        name: "Faculté de Droit et des Sciences Économiques et Politiques de Sousse",
        city: "Sousse",
        majors: [
          {
            id: "aqse-l1",
            name: "Licence Administration des Affaires (AQSE) — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Comptabilité", coef: 3, credits: 6,
                    modules: [{ name: "Comptabilité financière 1", coef: 3, regime: "MX" }],
                  },
                  {
                    name: "UE2 — Économie", coef: 3, credits: 6,
                    modules: [
                      { name: "Microéconomie", coef: 2, regime: "MX" },
                      { name: "Introduction à l'économie", coef: 1, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE3 — Gestion & Droit", coef: 3, credits: 6,
                    modules: [
                      { name: "Introduction à la gestion", coef: 1.5, regime: "MX" },
                      { name: "Droit des affaires", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Quantitatif", coef: 3, credits: 6,
                    modules: [
                      { name: "Mathématiques", coef: 1.5, regime: "MX" },
                      { name: "Statistiques descriptives", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 6,
                    modules: [
                      { name: "Anglais 1", coef: 1, regime: "CC" },
                      { name: "Techniques d'expression", coef: 1, regime: "CC" },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Organisations & Marketing", coef: 4, credits: 8,
                    modules: [
                      { name: "Théories des organisations", coef: 2, regime: "MX" },
                      { name: "Marketing fondamental", coef: 2, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité 2", coef: 3, credits: 6,
                    modules: [{ name: "Comptabilité financière 2", coef: 3, regime: "MX" }],
                  },
                  {
                    name: "UE3 — Macroéconomie & Droit", coef: 3, credits: 6,
                    modules: [
                      { name: "Macroéconomie", coef: 1.5, regime: "MX" },
                      { name: "Droit commercial", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Quantitatif 2", coef: 3, credits: 6,
                    modules: [
                      { name: "Mathématiques financières", coef: 1.5, regime: "MX" },
                      { name: "Probabilités", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais 2", coef: 1, regime: "CC" },
                      { name: "Bureautique", coef: 1, regime: "CC" },
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

  // ===== Université de Tunis El Manar =====
  {
    id: "utm",
    name: "Université de Tunis El Manar",
    institutes: [
      {
        id: "fst",
        name: "FST — Faculté des Sciences de Tunis",
        city: "Tunis",
        majors: [
          {
            id: "math-l1",
            name: "Licence Mathématiques — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Analyse", coef: 4, credits: 8,
                    modules: [
                      { name: "Analyse 1", coef: 2, regime: "MX" },
                      { name: "Topologie", coef: 2, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE2 — Algèbre", coef: 4, credits: 8,
                    modules: [
                      { name: "Algèbre linéaire 1", coef: 2, regime: "MX" },
                      { name: "Arithmétique", coef: 2, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE3 — Physique", coef: 3, credits: 6,
                    modules: [
                      { name: "Mécanique", coef: 1.5, regime: "MX" },
                      { name: "Électricité", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Informatique", coef: 2, credits: 4,
                    modules: [{ name: "Programmation C", coef: 2, regime: "MX" }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, regime: "CC" },
                      { name: "Français", coef: 1, regime: "CC" },
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

  // ===== Université de Sfax =====
  {
    id: "us",
    name: "Université de Sfax",
    institutes: [
      {
        id: "fseg-sfax",
        name: "FSEG Sfax — Faculté des Sciences Économiques et de Gestion",
        city: "Sfax",
        majors: [
          {
            id: "gestion-l1",
            name: "Licence Sciences de Gestion — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Économie", coef: 4, credits: 8,
                    modules: [
                      { name: "Microéconomie", coef: 2, regime: "MX" },
                      { name: "Macroéconomie", coef: 2, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité", coef: 4, credits: 8,
                    modules: [{ name: "Comptabilité financière 1", coef: 4, regime: "MX" }],
                  },
                  {
                    name: "UE3 — Maths & Stats", coef: 3, credits: 6,
                    modules: [
                      { name: "Mathématiques", coef: 1.5, regime: "MX" },
                      { name: "Statistiques", coef: 1.5, regime: "MX" },
                    ],
                  },
                  {
                    name: "UE4 — Droit", coef: 2, credits: 4,
                    modules: [{ name: "Introduction au droit", coef: 2, regime: "MX" }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, regime: "CC" },
                      { name: "Communication", coef: 1, regime: "CC" },
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

// ============= Calculation engine =============

export type ModuleGrades = { examen: string; ds: string; cc: string };

export function clamp(v: number): number {
  return Math.min(20, Math.max(0, v));
}

const MX_WEIGHTS: Record<ExamType, number> = { examen: 0.7, ds: 0.2, cc: 0.1 };

/** Examen types displayed/used per regime. */
export function regimeFields(regime: Regime): ExamType[] {
  return regime === "CC" ? ["cc"] : ["examen", "ds", "cc"];
}

/** Final module note based on regime. */
export function moduleFinalNote(g: ModuleGrades, regime: Regime): number | null {
  if (regime === "CC") {
    const v = parseFloat(g.cc);
    return isNaN(v) ? null : clamp(v);
  }
  // MX: 70/20/10, rebalance if some fields missing
  const fields: ExamType[] = ["examen", "ds", "cc"];
  const present: ExamType[] = [];
  for (const t of fields) if (!isNaN(parseFloat(g[t]))) present.push(t);
  if (present.length === 0) return null;
  const totalWeight = present.reduce((s, t) => s + MX_WEIGHTS[t], 0);
  let sum = 0;
  for (const t of present) sum += clamp(parseFloat(g[t])) * MX_WEIGHTS[t];
  return sum / totalWeight;
}

export function ueAverage(ue: UEDef, grades: Record<string, ModuleGrades>): number | null {
  let w = 0, c = 0, any = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleFinalNote(g, m.regime);
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

// ============= Flat lookup helpers (for Combobox search) =============

export interface InstituteEntry {
  university: UniversityDef;
  institute: InstituteDef;
}

export function listAllInstitutes(): InstituteEntry[] {
  const out: InstituteEntry[] = [];
  for (const u of universities) for (const i of u.institutes) out.push({ university: u, institute: i });
  return out;
}
