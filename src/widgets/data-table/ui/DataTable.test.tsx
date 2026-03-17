import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type ColumnDef } from "./DataTable";

interface TestRow {
  id: string;
  name: string;
  value: number;
}

const columns: ColumnDef<TestRow>[] = [
  { id: "name", header: "Name", accessorFn: (r) => r.name, sortable: true },
  { id: "value", header: "Value", accessorFn: (r) => r.value },
];

const data: TestRow[] = [
  { id: "1", name: "Alice", value: 100 },
  { id: "2", name: "Bob", value: 200 },
  { id: "3", name: "Charlie", value: 300 },
];

describe("DataTable", () => {
  it("renders table with data", () => {
    render(<DataTable columns={columns} data={data} keyFn={(r) => r.id} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<DataTable columns={columns} data={data} keyFn={(r) => r.id} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(<DataTable columns={columns} data={[]} loading keyFn={(r) => r.id} />);
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table.querySelectorAll("[data-slot=skeleton]").length).toBeGreaterThan(0);
  });

  it("supports sortable columns", async () => {
    const onSort = jest.fn();
    render(
      <DataTable columns={columns} data={data} onSort={onSort} keyFn={(r) => r.id} />,
    );

    await userEvent.setup().click(screen.getByText("Name"));
    expect(onSort).toHaveBeenCalledWith("name", "asc");
  });

  it("toggles sort direction", async () => {
    const onSort = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onSort={onSort}
        sort={{ columnId: "name", direction: "asc" }}
        keyFn={(r) => r.id}
      />,
    );

    await userEvent.setup().click(screen.getByText("Name"));
    expect(onSort).toHaveBeenCalledWith("name", "desc");
  });

  it("sets aria-sort on sorted column", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        sort={{ columnId: "name", direction: "asc" }}
        keyFn={(r) => r.id}
      />,
    );

    const th = screen.getByText("Name").closest("th");
    expect(th).toHaveAttribute("aria-sort", "ascending");
  });

  it("supports row click", async () => {
    const onRowClick = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        keyFn={(r) => r.id}
      />,
    );

    await userEvent.setup().click(screen.getByText("Alice"));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it("renders pagination controls", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ hasNextPage: true, hasPreviousPage: false }}
        keyFn={(r) => r.id}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  it("calls pagination handlers", async () => {
    const onNext = jest.fn();
    const onPrev = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ hasNextPage: true, hasPreviousPage: true }}
        onNextPage={onNext}
        onPreviousPage={onPrev}
        keyFn={(r) => r.id}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onNext).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });
});
