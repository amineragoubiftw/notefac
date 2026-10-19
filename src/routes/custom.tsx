import { createFileRoute } from "@tanstack/react-router";
import { CustomWorkspace } from "@/components/CustomWorkspace";

export const Route = createFileRoute("/custom")({
  component: CustomWorkspace,
  head: () => ({ meta: [
    { title: "Mode personnalisé — NoteFac" },
    { name: "description", content: "Créez vos semestres, UE et modules avec des coefficients et pondérations personnalisés dans NoteFac." },
    { property: "og:title", content: "Mode personnalisé — NoteFac" },
    { property: "og:description", content: "Votre espace de calcul universitaire personnalisé : notes, moyennes et crédits." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});