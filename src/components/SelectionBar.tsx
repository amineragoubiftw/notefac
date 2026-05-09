import { useMemo, useState } from "react";
import { Building2, BookOpen, GraduationCap, Search, Plus, Check, ChevronsUpDown } from "lucide-react";
import { universities, listAllInstitutes } from "@/lib/lmd-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SelectionBarProps {
  universityId: string;
  instituteId: string;
  majorId: string;
  onChange: (sel: { universityId: string; instituteId: string; majorId: string }) => void;
}

export function SelectionBar({ universityId, instituteId, majorId, onChange }: SelectionBarProps) {
  const [openInst, setOpenInst] = useState(false);
  const [openMajor, setOpenMajor] = useState(false);

  const allInstitutes = useMemo(() => listAllInstitutes(), []);
  const uni = universities.find((u) => u.id === universityId);
  const inst = uni?.institutes.find((i) => i.id === instituteId);
  const major = inst?.majors.find((m) => m.id === majorId);

  return (
    <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Université (read-only display, derived from établissement) */}
      <Field icon={<GraduationCap className="w-4 h-4" />} label="Université">
        <div className="glass-input flex items-center text-sm text-foreground/90 select-none">
          {uni ? uni.name : <span className="text-muted-foreground">— auto —</span>}
        </div>
      </Field>

      {/* Établissement — searchable combobox across ALL universities */}
      <Field icon={<Building2 className="w-4 h-4" />} label="Établissement">
        <Popover open={openInst} onOpenChange={setOpenInst}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="glass-input w-full flex items-center justify-between text-left cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className={inst ? "text-foreground truncate" : "text-muted-foreground"}>
                {inst ? inst.name : "Rechercher un établissement (ISET, FSEG, ISIG, FDSEPS…)"}
              </span>
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="p-0 w-[min(420px,90vw)] glass-card border-glass-border bg-transparent backdrop-blur-2xl"
          >
            <Command className="bg-transparent">
              <div className="flex items-center border-b border-glass-border px-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <CommandInput placeholder="Tapez ISET, FSEG, ISIG…" className="bg-transparent" />
              </div>
              <CommandList className="max-h-72">
                <CommandEmpty>
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Aucun établissement trouvé.
                  </div>
                </CommandEmpty>
                {allInstitutes.map(({ university, institute }) => (
                  <CommandItem
                    key={institute.id}
                    value={`${institute.name} ${institute.id} ${university.name} ${institute.city ?? ""}`}
                    onSelect={() => {
                      onChange({
                        universityId: university.id,
                        instituteId: institute.id,
                        majorId: "",
                      });
                      setOpenInst(false);
                    }}
                    className="flex items-start gap-2 cursor-pointer aria-selected:bg-white/10"
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        institute.id === instituteId ? "opacity-100 text-primary" : "opacity-0"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{institute.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {university.name}
                        {institute.city ? ` · ${institute.city}` : ""}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Field>

      {/* Spécialité — combobox within selected establishment */}
      <Field icon={<BookOpen className="w-4 h-4" />} label="Spécialité / Parcours">
        <div className="flex items-center gap-2">
          <Popover open={openMajor} onOpenChange={(v) => inst && setOpenMajor(v)}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={!inst}
                className="glass-input flex-1 flex items-center justify-between text-left cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={major ? "text-foreground truncate" : "text-muted-foreground"}>
                  {major
                    ? major.name
                    : inst
                    ? "Sélectionner un parcours"
                    : "Choisir d'abord l'établissement"}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-0 w-[min(420px,90vw)] glass-card border-glass-border bg-transparent backdrop-blur-2xl"
            >
              <Command className="bg-transparent">
                <div className="flex items-center border-b border-glass-border px-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <CommandInput placeholder="Filtrer les parcours…" className="bg-transparent" />
                </div>
                <CommandList className="max-h-72">
                  <CommandEmpty>
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Aucun parcours.
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {inst?.majors.map((m) => (
                      <CommandItem
                        key={m.id}
                        value={m.name}
                        onSelect={() => {
                          onChange({ universityId, instituteId, majorId: m.id });
                          setOpenMajor(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer aria-selected:bg-white/10"
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 ${
                            m.id === majorId ? "opacity-100 text-primary" : "opacity-0"
                          }`}
                        />
                        <span className="text-sm text-foreground">{m.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <SuggestMajorButton />
        </div>
      </Field>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function SuggestMajorButton() {
  const [open, setOpen] = useState(false);
  const [school, setSchool] = useState("");
  const [majorName, setMajorName] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    try {
      const key = "lmd-calc:suggestions:v1";
      const raw = window.localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ school, majorName, details, ts: Date.now() });
      window.localStorage.setItem(key, JSON.stringify(arr));
    } catch {
      // ignore
    }
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setSchool("");
      setMajorName("");
      setDetails("");
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Suggérer un parcours"
          className="glass-input w-10 h-10 shrink-0 flex items-center justify-center text-primary hover:bg-white/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-glass-border bg-transparent backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Suggérer un parcours</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Votre école n'est pas encore dans la base ? Envoyez-nous les détails et nous l'ajouterons.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center text-success text-sm font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Merci ! Votre suggestion a été enregistrée.
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="glass-input w-full"
              placeholder="Établissement (ex: ISET Sousse)"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <input
              className="glass-input w-full"
              placeholder="Nom du parcours / spécialité"
              value={majorName}
              onChange={(e) => setMajorName(e.target.value)}
            />
            <textarea
              className="glass-input w-full min-h-[80px]"
              placeholder="UE, modules, coefficients, crédits… (optionnel)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        )}

        {!submitted && (
          <DialogFooter>
            <button
              onClick={submit}
              disabled={!school.trim() || !majorName.trim()}
              className="glass-card px-4 py-2 text-sm text-primary hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Envoyer la suggestion
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
