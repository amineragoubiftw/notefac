import { afterEach, expect, test } from "bun:test";
import { universities } from "./lmd-data";
import { CATALOG_URL, DESKTOP_CATALOG_KEY, readDesktopCatalog, refreshDesktopCatalog } from "./desktop-curriculum";

const originalFetch = globalThis.fetch;
const originalStorage = globalThis.localStorage;
afterEach(() => {
  globalThis.fetch = originalFetch;
  Object.defineProperty(globalThis, "localStorage", { value: originalStorage, configurable: true });
});
function storage() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", { value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }, configurable: true });
  return values;
}
test("offline startup keeps the last downloaded catalog", () => {
  const values = storage();
  const catalog = structuredClone(universities);
  catalog[0].name = "Updated university";
  values.set(DESKTOP_CATALOG_KEY, JSON.stringify(catalog));
  expect(readDesktopCatalog()[0].name).toBe("Updated university");
});
test("web updates refresh programs without altering saved grades", async () => {
  const values = storage();
  values.set("lmd-calc:grades:v1", '{"saved":"14"}');
  const catalog = structuredClone(universities);
  catalog[0].name = "Updated university";
  globalThis.fetch = (async (url) => {
    expect(url).toBe(CATALOG_URL);
    return Response.json(catalog);
  }) as typeof fetch;
  await refreshDesktopCatalog();
  expect(readDesktopCatalog()[0].name).toBe("Updated university");
  expect(values.get("lmd-calc:grades:v1")).toBe('{"saved":"14"}');
});
test("broken responses never overwrite the offline cache", async () => {
  const values = storage();
  values.set(DESKTOP_CATALOG_KEY, JSON.stringify(universities));
  globalThis.fetch = (async () => Response.json([])) as typeof fetch;
  await expect(refreshDesktopCatalog()).rejects.toThrow();
  expect(readDesktopCatalog()).toEqual(universities);
});
test("first offline launch uses the bundled catalog", () => {
  storage();
  expect(readDesktopCatalog()).toEqual(universities);
});