import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, LogOut, ShieldCheck, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { universities } from "@/lib/lmd-data";
import type { Proposal } from "@/lib/curriculum";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [
    { title: "Validation des propositions — NoteFac" },
    { name: "description", content: "Validez les modules proposés par la communauté avant leur ajout au programme officiel NoteFac." },
    { property: "og:title", content: "Validation des propositions — NoteFac" },
    { property: "og:description", content: "Espace de modération des programmes proposés." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
});

function placeName(p: Proposal) {
  const u = universities.find((x) => x.id === p.university_id);
  const i = u?.institutes.find((x) => x.id === p.institute_id);
  return `${u?.name ?? p.university_id} · ${i?.name ?? p.institute_id}`;
}

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Proposal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("curriculum_proposals").select("*").eq("status", "pending").order("created_at");
    if (error) setError("Chargement impossible."); else setItems((data ?? []) as unknown as Proposal[]);
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(Boolean(data));
      if (data) load();
    });
  }, [user, load]);

  async function review(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("curriculum_proposals").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) { setError("Action impossible."); return; }
    setItems((list) => list.filter((p) => p.id !== id));
  }

  return <main className="relative min-h-screen mesh-gradient px-4 pb-16 pt-8 text-foreground">
    <div className="mx-auto max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/"><ArrowLeft />Calculateur principal</Link></Button>
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold"><ShieldCheck className="size-7 text-primary" />Propositions à valider</h1>
      {!ready ? <p className="text-muted-foreground">Chargement…</p>
        : !user ? <Button onClick={() => lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` })}>Se connecter avec Google</Button>
        : !isAdmin ? <div className="space-y-4"><p className="text-muted-foreground">Ce compte ({user.email}) n’a pas les droits d’administration.</p><Button variant="outline" onClick={() => supabase.auth.signOut()}><LogOut />Se déconnecter</Button></div>
        : <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>{user.email}</span><Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}><LogOut />Se déconnecter</Button></div>
          {error && <p role="alert" className="text-danger">{error}</p>}
          {items.length === 0 && <p className="py-12 text-center text-muted-foreground">Aucune proposition en attente.</p>}
          {items.map((p) => <article key={p.id} className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-bold">{p.major_name}</h2>
            <p className="mb-4 text-xs text-muted-foreground">{placeName(p)} · {p.created_at ? new Date(p.created_at).toLocaleString("fr-FR") : ""}</p>
            {p.semesters.map((s, si) => <div key={si} className="mb-3">
              <p className="font-semibold">{s.name}</p>
              {s.ues.map((ue, ui) => <div key={ui} className="ml-3 text-sm">
                <p>{ue.name} <span className="text-muted-foreground">(Coef {ue.coef} · {ue.credits} cr)</span></p>
                <ul className="ml-4 list-disc text-muted-foreground">{ue.modules.map((m, mi) => <li key={mi}>{m.name} — Coef {m.coef} · {m.credits} cr · Examen {m.weights.examen}% / DS {m.weights.ds}% / CC {m.weights.cc}%</li>)}</ul>
              </div>)}
            </div>)}
            <div className="mt-4 flex gap-2">
              <Button onClick={() => review(p.id, "approved")}><Check />Approuver</Button>
              <Button variant="outline" onClick={() => review(p.id, "rejected")}><X />Refuser</Button>
            </div>
          </article>)}
        </div>}
    </div>
  </main>;
}
