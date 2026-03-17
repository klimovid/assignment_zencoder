import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportButton } from "./ExportButton";

describe("ExportButton", () => {
  const mockExport = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockExport.mockClear();
  });

  it("renders export button", () => {
    render(<ExportButton onExport={mockExport} />);
    expect(
      screen.getByRole("button", { name: "Export data" }),
    ).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    render(<ExportButton onExport={mockExport} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Export data" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Export as CSV" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Export as NDJSON" })).toBeInTheDocument();
  });

  it("calls onExport with csv format", async () => {
    render(<ExportButton onExport={mockExport} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Export data" }));
    await user.click(screen.getByRole("menuitem", { name: "Export as CSV" }));

    expect(mockExport).toHaveBeenCalledWith("csv");
  });

  it("calls onExport with ndjson format", async () => {
    render(<ExportButton onExport={mockExport} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Export data" }));
    await user.click(screen.getByRole("menuitem", { name: "Export as NDJSON" }));

    expect(mockExport).toHaveBeenCalledWith("ndjson");
  });

  it("shows exporting state during export", async () => {
    let resolveExport: () => void;
    const slowExport = jest.fn(
      () => new Promise<void>((resolve) => { resolveExport = resolve; }),
    );

    render(<ExportButton onExport={slowExport} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Export data" }));
    await user.click(screen.getByRole("menuitem", { name: "Export as CSV" }));

    expect(screen.getByText("Exporting…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export data" })).toBeDisabled();

    resolveExport!();
    await waitFor(() => {
      expect(screen.getByText("Export")).toBeInTheDocument();
    });
  });

  it("respects disabled prop", () => {
    render(<ExportButton onExport={mockExport} disabled />);
    expect(screen.getByRole("button", { name: "Export data" })).toBeDisabled();
  });

  it("sets aria-expanded attribute", async () => {
    render(<ExportButton onExport={mockExport} />);
    const user = userEvent.setup();

    const btn = screen.getByRole("button", { name: "Export data" });
    expect(btn).toHaveAttribute("aria-expanded", "false");

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
