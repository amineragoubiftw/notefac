import { z } from "zod";
import { universities, type UniversityDef } from "./lmd-data";

export const DESKTOP_CATALOG_KEY = "notefac:desktop-catalog:v1";
export const CATALOG_URL = "https://notefac.lovable.app/api/public/curriculum";
const number = z.number().finite().nonnegative();
const assessment = z.enum(["examen", "ds", "cc", "ds1", "ds2", "control"]);
const moduleSchema = z.object({
  name: z.string().min(1), coef: number, credits: number.optional(),
  examTypes: z.array(assessment).optional(), rg: z.enum(["MX", "CC"]).optional(),
  weights: z.record(assessment, number).optional(),
});
export const catalogSchema = z.array(z.object({
  id: z.string().min(1), name: z.string().min(1), institutes: z.array(z.object({
    id: z.string().min(1), name: z.string().min(1), majors: z.array(z.object({
      id: z.string().min(1), name: z.string().min(1), semesters: z.array(z.object({
        name: z.string().min(1), ues: z.array(z.object({
          name: z.string().min(1), coef: number, credits: number,
          rg: z.enum(["MX", "CC"]).optional(), optionGroup: z.string().optional(),
          modules: z.array(moduleSchema),
        })),
      })),
    })),
  })),
})).min(1);

export function readDesktopCatalog(): UniversityDef[] {
  try {
    const parsed = catalogSchema.safeParse(JSON.parse(localStorage.getItem(DESKTOP_CATALOG_KEY) || "null"));
    return parsed.success ? parsed.data : universities;
  } catch { return universities; }
}

/** Never update saved grades or replace a good cache with an invalid response. */
export async function refreshDesktopCatalog(): Promise<UniversityDef[]> {
  const response = await fetch(CATALOG_URL, { cache: "no-store", credentials: "omit", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("Curriculum update unavailable");
  const catalog = catalogSchema.parse(await response.json());
  try { localStorage.setItem(DESKTOP_CATALOG_KEY, JSON.stringify(catalog)); } catch { /* Still usable for this session. */ }
  return catalog;
}