"use client";

import { useState } from "react";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
import type { DiffFile } from "@entities/session/model/types";

interface DiffViewerProps {
  files: DiffFile[];
  mode?: "unified" | "split";
}

export function DiffViewer({ files, mode: initialMode = "unified" }: DiffViewerProps) {
  const [mode, setMode] = useState(initialMode);
  const [selectedFile, setSelectedFile] = useState(0);

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No changes to display
      </div>
    );
  }

  const file = files[selectedFile]!;

  return (
    <div className="rounded-lg border">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <div role="group" aria-label="Diff view mode" className="flex gap-1">
          <Button
            variant={mode === "unified" ? "default" : "outline"}
            size="xs"
            onClick={() => setMode("unified")}
            aria-pressed={mode === "unified"}
          >
            Unified
          </Button>
          <Button
            variant={mode === "split" ? "default" : "outline"}
            size="xs"
            onClick={() => setMode("split")}
            aria-pressed={mode === "split"}
          >
            Split
          </Button>
        </div>

        <span className="text-xs text-muted-foreground">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* File tabs */}
      {files.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b px-3 py-1" role="tablist">
          {files.map((f, i) => (
            <button
              key={f.path}
              role="tab"
              aria-selected={i === selectedFile}
              className={cn(
                "rounded px-2 py-1 text-xs font-mono whitespace-nowrap transition-colors",
                i === selectedFile ? "bg-muted font-medium" : "hover:bg-muted/50 text-muted-foreground",
              )}
              onClick={() => setSelectedFile(i)}
            >
              {f.path}
              <span className="ml-1.5 text-green-600">+{f.additions}</span>
              <span className="ml-0.5 text-red-600">-{f.deletions}</span>
            </button>
          ))}
        </div>
      )}

      {/* Diff content */}
      <div className="overflow-x-auto">
        {file.hunks.map((hunk, i) => (
          <div key={i} className="border-b last:border-b-0">
            <div className="bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
              {hunk.content}
            </div>
            <pre className={cn("px-3 py-2 text-xs font-mono", mode === "split" && "columns-2 gap-4")}>
              {hunk.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
