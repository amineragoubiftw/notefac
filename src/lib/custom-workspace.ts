import { type ModuleGrades, type UEDef } from "./lmd-data";

export const assessments = ["examen", "ds", "cc"] as const;
export type Assessment = typeof assessments[number];
export interface CustomModule {
  id: string;
  name: string;
  coef: number;
  credits: number;
  rg: string;
  weights: Record<Assessment, number>;
  grades: ModuleGrades;
}
export interface CustomUE { id: string; name: string; coef: number; credits: number; modules: CustomModule[] }
export interface CustomSemester { id: string; name: string; ues: CustomUE[] }
export interface CustomWorkspace { semesters: CustomSemester[]; universityId?: string; instituteId?: string; parcoursName?: string }

export function selectUniversity(workspace: CustomWorkspace, universityId: string): CustomWorkspace {
  return { ...workspace, universityId, instituteId: "" };
}

export function newModule(): CustomModule {
  return { id: crypto.randomUUID(), name: "Nouveau module", coef: 1, credits: 0, rg: "MX", weights: { examen: 70, ds: 20, cc: 10 }, grades: {} };
}
export function newUE(): CustomUE {
  return { id: crypto.randomUUID(), name: "Nouvelle UE", coef: 1, credits: 0, modules: [] };
}
export function validWeights(module: CustomModule): boolean {
  return assessments.every((field) => Number.isFinite(module.weights[field]) && module.weights[field] >= 0 && module.weights[field] <= 100)
    && Math.abs(assessments.reduce((sum, field) => sum + module.weights[field], 0) - 100) < 0.000001;
}
export function semesterData(semester: CustomSemester): { ues: UEDef[]; grades: Record<string, ModuleGrades>; valid: boolean } {
  const grades: Record<string, ModuleGrades> = {};
  const ues = semester.ues.map((ue) => ({
    name: ue.id, coef: ue.coef, credits: ue.credits,
    modules: ue.modules.map((module) => {
      grades[module.id] = module.grades;
      return { name: module.id, coef: module.coef, credits: module.credits, examTypes: [...assessments], weights: module.weights };
    }),
  }));
  return { ues, grades, valid: semester.ues.every((ue) => ue.modules.every(validWeights)) };
}