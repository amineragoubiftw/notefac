import { useEffect, useState } from "react";
import { Download, MonitorDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTALLER_URL = "https://github.com/amineragoubiftw/notefac/releases/download/v1.0.1/installer.exe";

export function DesktopInstallNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_DESKTOP === "true") return;
    try {
      setVisible(sessionStorage.getItem("notefac:install-notice-dismissed") !== "true");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem("notefac:install-notice-dismissed", "true");
    } catch {
      // Dismissal still works when browser storage is unavailable.
    }
  }

  if (!visible) return null;

  return (
    <aside
      role="status"
      aria-label="Application NoteFac pour Windows"
      className="fixed bottom-4 right-4 left-4 z-40 rounded-lg border border-glass-border bg-card/95 p-4 text-card-foreground shadow-lg backdrop-blur-xl sm:left-auto sm:w-96"
    >
      <div className="flex items-start gap-3">
        <MonitorDown className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="pr-6 text-sm font-semibold">Installez NoteFac sur votre PC</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Vos calculs et notes accessibles hors ligne.
          </p>
          <Button asChild size="sm" className="mt-3">
            <a href={INSTALLER_URL} target="_blank" rel="noopener noreferrer">
              <Download aria-hidden="true" /> Télécharger pour Windows
            </a>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Windows uniquement · 222 MB</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-8"
          aria-label="Fermer la notification"
          title="Fermer"
          onClick={dismiss}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}