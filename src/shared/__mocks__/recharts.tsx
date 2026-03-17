import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
function createMock(name: string) {
  const Mock = ({ children, ...props }: any) => (
    <div data-testid={`recharts-${name}`} {...props}>
      {children}
    </div>
  );
  Mock.displayName = `Recharts.${name}`;
  return Mock;
}

export const ResponsiveContainer = createMock("responsive-container");
export const LineChart = createMock("line-chart");
export const Line = createMock("line");
export const BarChart = createMock("bar-chart");
export const Bar = createMock("bar");
export const AreaChart = createMock("area-chart");
export const Area = createMock("area");
export const PieChart = createMock("pie-chart");
export const Pie = createMock("pie");
export const Cell = createMock("cell");
export const XAxis = createMock("x-axis");
export const YAxis = createMock("y-axis");
export const CartesianGrid = createMock("cartesian-grid");
export const Tooltip = createMock("tooltip");
export const Legend = createMock("legend");
export const Label = createMock("label");
