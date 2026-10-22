import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { universities as baseUniversities, type ModuleDef, type UniversityDef } from "./lmd-data";
import type { CustomSemester } from "./custom-workspace";
import { readDesktopCatalog, refreshDesktopCatalog } from "./desktop-curriculum";

export interface ProposedModule { name: string; coef: number; credits: number; weights: { examen: number; ds: number; cc: number } }
export interface ProposedUE { name: string; coef: number; credits: number; modules: ProposedModule[] }
export interface ProposedSemester { name: string; ues: ProposedUE[] }
export interface Proposal { id: string; university_id: string; institute_id: string; major_name: string; semesters: ProposedSemester[]; status?: string; created_at?: string }

const CACHE_KEY = "notefac:approved-curricula:v1";
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export function toProposalSemesters(semesters: CustomSemester[]): ProposedSemester[] {
  return semesters.map((s) => ({ name: s.name.trim() || "Semestre", ues: s.ues.map((ue) => ({ name: ue.name.trim() || "UE", coef: ue.coef, credits: ue.credits, modules: ue.modules.map((m) => ({ name: m.name.trim() || "Module", coef: m.coef, credits: m.credits, weights: { ...m.weights } })) })) }));
}

function toModule(m: ProposedModule): ModuleDef {
  return { name: m.name, coef: m.coef, credits: m.credits, examTypes: ["examen", "ds", "cc"], weights: { ...m.weights } };
}

/** Adds approved proposals to the official curricula. Existing official modules are never overwritten. */
export function mergeProposals(base: UniversityDef[], proposals: Proposal[]): UniversityDef[] {
  const result: UniversityDef[] = structuredClone(base);
  for (const p of proposals) {
    const institute = result.find((u) => u.id === p.university_id)?.institutes.find((i) => i.id === p.institute_id);
    if (!institute || !Array.isArray(p.semesters)) continue;
    let major = institute.majors.find((m) => same(m.name, p.major_name));
    if (!major) {
      major = { id: `community-${institute.id}-${slug(p.major_name)}`, name: p.major_name.trim(), semesters: [] };
      institute.majors.push(major);
    }
    for (const s of p.semesters) {
      let semester = major.semesters.find((x) => same(x.name, s.name));
      if (!semester) { semester = { name: s.name, ues: [] }; major.semesters.push(semester); }
      for (const ue of s.ues ?? []) {
        let target = semester.ues.find((x) => same(x.name, ue.name));
        if (!target) { target = { name: ue.name, coef: ue.coef, credits: ue.credits, modules: [] }; semester.ues.push(target); }
        for (const m of ue.modules ?? []) {
          if (!target.modules.some((x) => same(x.name, m.name))) target.modules.push(toModule(m));
        }
      }
    }
  }
  return result;
}

async function fetchApproved(): Promise<Proposal[]> {
  const { data, error } = await supabase.from("curriculum_proposals").select("id, university_id, institute_id, major_name, semesters").eq("status", "approved").order("created_at").abortSignal(AbortSignal.timeout(10_000));
  if (error) throw error;
  const rows = (data ?? []) as unknown as Proposal[];
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(rows)); } catch { /* ignore */ }
  return rows;
}
function cached(): Proposal[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]"); } catch { return []; }
}

/** Official curricula plus approved community additions (cached for offline use). */
export function useCurriculum(): UniversityDef[] {
  const desktop = import.meta.env.VITE_DESKTOP === "true";
  const { data: catalog } = useQuery({
    queryKey: ["desktop-official-catalog"],
    queryFn: refreshDesktopCatalog,
    enabled: desktop,
    initialData: desktop ? readDesktopCatalog : undefined,
    initialDataUpdatedAt: 0,
    staleTime: 60_000,
    refetchInterval: desktop ? 60_000 : false,
    refetchOnWindowFocus: desktop,
    refetchOnReconnect: true,
    retry: false,
  });
  const { data } = useQuery({
    queryKey: ["approved-curricula"],
    queryFn: async () => { try { return await fetchApproved(); } catch (e) { console.warn("[curriculum] using cache", e); return cached(); } },
    staleTime: 5 * 60_000,
    initialData: desktop ? cached : undefined,
    initialDataUpdatedAt: 0,
    refetchInterval: desktop ? 60_000 : false,
    refetchOnReconnect: true,
    retry: false,
  });
  const base = desktop && catalog ? catalog : baseUniversities;
  return data && data.length ? mergeProposals(base, data) : base;
}

export async function submitProposal(p: Omit<Proposal, "id">) {
  const { error } = await supabase.from("curriculum_proposals").insert({ university_id: p.university_id, institute_id: p.institute_id, major_name: p.major_name, semesters: p.semesters as never });
  if (error) throw error;
}
