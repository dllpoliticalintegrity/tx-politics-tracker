import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SiteRetiredDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This site is no longer being maintained</DialogTitle>
          <DialogDescription>
            Please go to{" "}
            <a
              href="https://integrityindex.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              integrityindex.us
            </a>{" "}
            to follow our Congressional coverage.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild>
            <a href="https://integrityindex.us" target="_blank" rel="noopener noreferrer">
              Visit integrityindex.us
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}