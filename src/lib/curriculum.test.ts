/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { mergeProposals, type Proposal } from "./curriculum";
import { universities } from "./lmd-data";

const firstWithMajor = universities.flatMap((u) => u.institutes.map((i) => ({ u, i }))).find(({ i }) => i.majors.length > 0)!;
const official = firstWithMajor.i.majors[0];
const mod = { name: "Nouveau cours", coef: 2, credits: 3, weights: { examen: 70, ds: 20, cc: 10 } };

describe("approved proposals", () => {
  test("a new parcours is added to the chosen establishment", () => {
    const empty = universities.flatMap((u) => u.institutes.map((i) => ({ u, i }))).find(({ i }) => i.majors.length === 0)!;
    const p: Proposal = { id: "1", university_id: empty.u.id, institute_id: empty.i.id, major_name: "Info", semesters: [{ name: "S1", ues: [{ name: "UE1", coef: 1, credits: 5, modules: [mod] }] }] };
    const merged = mergeProposals(universities, [p]);
    const inst = merged.find((u) => u.id === empty.u.id)!.institutes.find((i) => i.id === empty.i.id)!;
    expect(inst.majors[0].name).toBe("Info");
    expect(inst.majors[0].semesters[0].ues[0].modules[0].coef).toBe(2);
  });
  test("a module is appended to an existing official UE without changing original modules", () => {
    const sem = official.semesters[0]; const ue = sem.ues[0];
    const p: Proposal = { id: "2", university_id: firstWithMajor.u.id, institute_id: firstWithMajor.i.id, major_name: official.name, semesters: [{ name: sem.name, ues: [{ name: ue.name, coef: 9, credits: 9, modules: [mod, { ...mod, name: ue.modules[0].name, coef: 99 }] }] }] };
    const merged = mergeProposals(universities, [p]);
    const target = merged.find((u) => u.id === firstWithMajor.u.id)!.institutes.find((i) => i.id === firstWithMajor.i.id)!.majors.find((m) => m.id === official.id)!.semesters[0].ues[0];
    expect(target.modules.length).toBe(ue.modules.length + 1);
    expect(target.modules[0].coef).toBe(ue.modules[0].coef);
    expect(target.coef).toBe(ue.coef);
    expect(ue.modules.some((m) => m.name === "Nouveau cours")).toBe(false);
  });
});
