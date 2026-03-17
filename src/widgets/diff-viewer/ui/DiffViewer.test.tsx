import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiffViewer } from "./DiffViewer";
import type { DiffFile } from "@entities/session/model/types";

const mockFiles: DiffFile[] = [
  {
    path: "src/parser.ts",
    hunks: [
      { oldStart: 10, oldLines: 5, newStart: 10, newLines: 8, content: "@@ -10,5 +10,8 @@" },
    ],
    additions: 8,
    deletions: 3,
  },
  {
    path: "src/utils.ts",
    hunks: [
      { oldStart: 1, oldLines: 2, newStart: 1, newLines: 4, content: "@@ -1,2 +1,4 @@" },
    ],
    additions: 4,
    deletions: 1,
  },
];

describe("DiffViewer", () => {
  it("renders empty state when no files", () => {
    render(<DiffViewer files={[]} />);
    expect(screen.getByText("No changes to display")).toBeInTheDocument();
  });

  it("renders file count", () => {
    render(<DiffViewer files={mockFiles} />);
    expect(screen.getByText("2 files")).toBeInTheDocument();
  });

  it("renders mode toggle", () => {
    render(<DiffViewer files={mockFiles} />);
    expect(screen.getByRole("group", { name: "Diff view mode" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unified" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split" })).toBeInTheDocument();
  });

  it("defaults to unified mode", () => {
    render(<DiffViewer files={mockFiles} />);
    expect(screen.getByRole("button", { name: "Unified" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("toggles to split mode", async () => {
    render(<DiffViewer files={mockFiles} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Split" }));

    expect(screen.getByRole("button", { name: "Split" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("renders file tabs for multiple files", () => {
    render(<DiffViewer files={mockFiles} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("switches between files", async () => {
    render(<DiffViewer files={mockFiles} />);
    const tabs = screen.getAllByRole("tab");

    await userEvent.setup().click(tabs[1]!);
    expect(tabs[1]!).toHaveAttribute("aria-selected", "true");
  });

  it("shows hunk headers", () => {
    render(<DiffViewer files={[mockFiles[0]!]} />);
    expect(screen.getAllByText("@@ -10,5 +10,8 @@").length).toBeGreaterThan(0);
  });

  it("does not render file tabs for single file", () => {
    render(<DiffViewer files={[mockFiles[0]!]} />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
