"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@shared/ui/button";

export type ExportFormat = "csv" | "ndjson";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
}

export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleExport(format: ExportFormat) {
    setExporting(true);
    setOpen(false);
    try {
      await onExport(format);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        disabled={disabled || exporting}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Export data"
      >
        <Download className="mr-1 size-3.5" />
        {exporting ? "Exporting…" : "Export"}
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border bg-popover p-1 shadow-md"
        >
          <button
            role="menuitem"
            className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
            onClick={() => handleExport("csv")}
          >
            Export as CSV
          </button>
          <button
            role="menuitem"
            className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
            onClick={() => handleExport("ndjson")}
          >
            Export as NDJSON
          </button>
        </div>
      )}
    </div>
  );
}
