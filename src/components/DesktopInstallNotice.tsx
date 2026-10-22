import { useEffect, useState } from "react";
import { Download, MonitorDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Content } from "@radix-ui/react-dialog";

const INSTALLER_URL = "https://github.com/amineragoubiftw/notefac/releases/download/v1.0.2/installer.msi";

export function DesktopInstallNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_DESKTOP === "true") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogPortal>
        <DialogOverlay className="bg-background/60 backdrop-blur-xl motion-reduce:animate-none" />
        <Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-y-auto rounded-lg border border-glass-border bg-card/80 px-6 py-12 text-center text-card-foreground shadow-xl backdrop-blur-2xl sm:px-12 sm:py-16 focus:outline-none">
          <MonitorDown className="mb-6 size-16 shrink-0 text-primary" aria-hidden="true" />
          <DialogTitle className="text-3xl font-bold leading-tight sm:text-4xl">Installez NoteFac sur votre PC</DialogTitle>
          <DialogDescription className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vos calculs et notes accessibles hors ligne.
          </DialogDescription>
          <Button asChild size="lg" className="mt-8 h-auto min-h-12 max-w-full whitespace-normal px-5 py-3 text-base">
            <a href={INSTALLER_URL} target="_blank" rel="noopener noreferrer">
              <Download aria-hidden="true" /> Télécharger pour Windows
            </a>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">Windows uniquement · 222 MB</p>
          <DialogClose asChild>
            <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 size-10"
          aria-label="Fermer la notification"
          title="Fermer"
        >
          <X aria-hidden="true" />
        </Button>
          </DialogClose>
        </Content>
      </DialogPortal>
    </Dialog>
  );
}