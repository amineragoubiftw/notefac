/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { moduleComputedNote, semesterAverage, totalCredits, ueAverage } from "./lmd-data";
import { semesterData, validWeights, type CustomModule } from "./custom-workspace";

const module: CustomModule = { id: "m1", name: "A", coef: 1, credits: 99, rg: "My rule", weights: { examen: 50, ds: 30, cc: 20 }, grades: { examen: "16", ds: "10", cc: "5" } };
describe("custom calculator rules", () => {
  test("freely chosen assessment weights calculate the module grade", () => {
    expect(moduleComputedNote(module.grades, ["examen", "ds", "cc"], undefined, module.weights)).toBe(12);
  });
  test("weights must total 100 percent", () => {
    expect(validWeights(module)).toBe(true);
    expect(validWeights({ ...module, weights: { examen: 50, ds: 30, cc: 10 } })).toBe(false);
  });
  test("UE weighting uses module coefficients, then semester uses UE coefficients", () => {
    const data = semesterData({ id: "s", name: "S", ues: [
      { id: "u1", name: "UE", coef: 2, credits: 6, modules: [module, { ...module, id: "m2", coef: 3, grades: { examen: "8", ds: "8", cc: "8" } }] },
      { id: "u2", name: "UE", coef: 1, credits: 4, modules: [{ ...module, id: "m3", coef: 8, grades: { examen: "18", ds: "18", cc: "18" } }] },
    ] });
    expect(ueAverage(data.ues[0], data.grades)).toBe(9);
    expect(semesterAverage(data.ues, data.grades)).toBe(12);
    expect(totalCredits(data.ues, data.grades)).toBe(4);
  });
  test("renamed and duplicate module names preserve independent grades through IDs", () => {
    const data = semesterData({ id: "s", name: "Renamed", ues: [{ id: "u", name: "UE", coef: 1, credits: 5, modules: [module, { ...module, id: "m2", grades: { examen: "20", ds: "20", cc: "20" } }] }] });
    expect(data.grades.m1.examen).toBe("16");
    expect(data.grades.m2.examen).toBe("20");
    expect(totalCredits(data.ues, data.grades)).toBe(5);
  });
  test("grades stay within zero to twenty", () => {
    expect(moduleComputedNote({ examen: "30", ds: "30", cc: "30" }, ["examen", "ds", "cc"], undefined, module.weights)).toBe(20);
    expect(moduleComputedNote({ examen: "-5", ds: "-5", cc: "-5" }, ["examen", "ds", "cc"], undefined, module.weights)).toBe(0);
  });
});