import { useState } from "react";
import { Share2, Download, Copy, Check, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { type ModuleGrades, type MajorDef } from "@/lib/lmd-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type YearGrades = Record<string, Record<string, ModuleGrades>>;

interface ShareControlsProps {
  major: MajorDef | undefined;
  yearGrades: YearGrades;
  onImport: (imported: YearGrades, majorId: string, majorName: string | null) => void;
}

function generateCode(): string {
  // 8-char unguessable code (avoid ambiguous chars)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function mergeYearGrades(current: YearGrades, imported: YearGrades): YearGrades {
  const out: YearGrades = { ...current };
  for (const sem of Object.keys(imported)) {
    const curSem = out[sem] || {};
    const newSem: Record<string, ModuleGrades> = { ...curSem };
    for (const mod of Object.keys(imported[sem])) {
      const curMod: ModuleGrades = curSem[mod] || {};
      const impMod: ModuleGrades = imported[sem][mod] || {};
      const merged: ModuleGrades = { ...curMod };
      const fields = new Set([...Object.keys(curMod), ...Object.keys(impMod)]) as Set<
        keyof ModuleGrades
      >;
      for (const f of fields) {
        const a = parseFloat(curMod[f] ?? "");
        const b = parseFloat(impMod[f] ?? "");
        const aValid = !Number.isNaN(a);
        const bValid = !Number.isNaN(b);
        if (aValid && bValid) merged[f] = String(Math.max(a, b));
        else if (bValid) merged[f] = impMod[f];
        else if (aValid) merged[f] = curMod[f];
      }
      newSem[mod] = merged;
    }
    out[sem] = newSem;
  }
  return out;
}

export function ShareControls({ major, yearGrades, onImport }: ShareControlsProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [importedInfo, setImportedInfo] = useState<string | null>(null);

  const hasGrades = Object.keys(yearGrades).length > 0;

  async function handleShare() {
    if (!major) return;
    setLoading(true);
    setError(null);
    try {
      const newCode = generateCode();
      const { error: dbErr } = await supabase.from("year_shares").insert({
        share_code: newCode,
        major_id: major.id,
        major_name: major.name,
        payload: yearGrades,
      });
      if (dbErr) throw dbErr;
      const url = `${window.location.origin}/?import=${newCode}`;
      setCode(newCode);
      setShareUrl(url);
      setQrUrl(await QRCode.toDataURL(url, { margin: 1, width: 220 }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to share");
    } finally {
      setLoading(false);
    }
  }

  function openShare() {
    setCode("");
    setShareUrl("");
    setQrUrl("");
    setError(null);
    setShareOpen(true);
    handleShare();
  }

  async function handleImport() {
    if (!major) return;
    const c = importCode.trim().toUpperCase();
    if (!c) return;
    setLoading(true);
    setError(null);
    setImportedInfo(null);
    try {
      const { data, error: dbErr } = await supabase
        .from("year_shares")
        .select("payload, major_id, major_name")
        .eq("share_code", c)
        .maybeSingle();
      if (dbErr) throw dbErr;
      if (!data) throw new Error("Code not found");
      if (data.major_id !== major.id) {
        throw new Error(
          `This share is for "${data.major_name ?? data.major_id}". Select the same major to import.`,
        );
      }
      onImport(data.payload as YearGrades, data.major_id);
      setImportedInfo("Grades imported and merged (highest values kept).");
      setImportCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to import");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(shareUrl || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        onClick={openShare}
        disabled={!major || !hasGrades}
        className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={!major ? "Select a major first" : !hasGrades ? "Add some grades first" : "Share your full year"}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share My Year</span>
      </button>

      <button
        onClick={() => {
          setError(null);
          setImportedInfo(null);
          setImportOpen(true);
        }}
        disabled={!major}
        className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={!major ? "Select a major first" : "Import a shared year"}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Import Year</span>
      </button>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="glass-card border-glass-border bg-transparent backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Share My Year</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              S1 + S2 — all subjects and Control grades included.
            </DialogDescription>
          </DialogHeader>

          {loading && !code ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating share…
            </div>
          ) : error ? (
            <p className="text-sm text-danger py-4">{error}</p>
          ) : code ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                {qrUrl && <img src={qrUrl} alt="Share QR code" className="rounded-lg bg-white p-2" />}
              </div>
              <div>
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Share code</label>
                <div className="glass-input mt-1 font-mono tracking-widest text-center text-lg">{code}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Share link</label>
                <div className="flex gap-2 mt-1">
                  <input readOnly value={shareUrl} className="glass-input flex-1 text-xs" />
                  <button onClick={copy} className="glass-card px-3 text-xs flex items-center gap-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <button onClick={() => setShareOpen(false)} className="glass-card px-3 py-1.5 text-xs">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="glass-card border-glass-border bg-transparent backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Import Year</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Paste a share code. Existing higher grades are kept (Final = max).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <input
              autoFocus
              value={importCode}
              onChange={(e) => setImportCode(e.target.value.toUpperCase())}
              placeholder="ABCD2345"
              className="glass-input w-full font-mono tracking-widest text-center text-lg"
              maxLength={16}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            {importedInfo && <p className="text-sm text-success">{importedInfo}</p>}
          </div>

          <DialogFooter className="gap-2">
            <button onClick={() => setImportOpen(false)} className="glass-card px-3 py-1.5 text-xs">
              Close
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !importCode.trim()}
              className="glass-card px-3 py-1.5 text-xs text-primary flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Import
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
