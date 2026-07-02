import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DonationPanel from "@/components/donate/DonationPanel";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "givebutter-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { id?: string },
        HTMLElement
      >;
    }
  }
}

const HIDDEN_ROUTES: string[] = [];

function DonationPageFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full bg-white overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <DonationPanel />
    </div>
  );
}

const FloatingDonateFab = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const isHiddenRoute = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    if (isHiddenRoute) return;
    const timer = setTimeout(() => setOpen(true), 45000);
    return () => clearTimeout(timer);
  }, [isHiddenRoute]);

  if (isHiddenRoute) return null;

  const positionStyle = isMobile
    ? {
        bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px) + 0.75rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 0.75rem)",
      }
    : { bottom: "1.5rem", right: "1.5rem" };

  const buttonClass =
    "fixed z-[60] flex items-center gap-2 rounded-full px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wider shadow-lg active:scale-95 transition-all bg-[#fdb417] text-black hover:bg-[#fdb417]/90";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={buttonClass}
        style={positionStyle}
        aria-label="Donate"
      >
        <Heart className="h-4 w-4" fill="currentColor" />
        Donate
      </button>

      {isMobile ? (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
              className="fixed inset-x-0 top-0 z-[80] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            />
            <DialogPrimitive.Content
              onOpenAutoFocus={(e) => e.preventDefault()}
              style={{
                top: "env(safe-area-inset-top, 0px)",
                bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))",
              }}
              className="fixed inset-x-0 z-[81] bg-white overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            >
              <DialogTitle className="sr-only">Donate</DialogTitle>
              <DialogDescription className="sr-only">
                Donate to Political Integrity PAC
              </DialogDescription>
              {open && <DonationPageFrame className="h-full" />}
              <DialogPrimitive.Close className="absolute right-2 top-2 z-10 rounded-full p-1 text-white shadow-md bg-black/70 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <X className="h-3 w-3" strokeWidth={3} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="fixed left-[50%] top-[50%] z-[81] translate-x-[-50%] translate-y-[-50%] w-full max-w-md h-[90vh] p-0 border-none bg-white rounded-2xl shadow-xl overflow-hidden [&>button]:right-2 [&>button]:top-2 [&>button]:rounded-full [&>button]:bg-black/70 [&>button]:p-1 [&>button]:text-white [&>button]:opacity-100 [&>button]:outline-none [&>button]:ring-0 [&>button]:ring-offset-0 [&>button:focus]:ring-0 [&>button:focus-visible]:ring-0 [&>button>svg]:h-3 [&>button>svg]:w-3"
          >
            <DialogTitle className="sr-only">Donate</DialogTitle>
            <DialogDescription className="sr-only">
              Donate to Political Integrity PAC
            </DialogDescription>
            {open && <DonationPageFrame className="h-full" />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FloatingDonateFab;