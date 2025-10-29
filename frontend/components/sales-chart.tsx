"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesData {
  month: string;
  total: number;
}

interface SalesChartProps {
  data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
  // Fallback if no data
  const chartData =
    data && data.length > 0
      ? data.map((item) => ({
          name: item.month,
          sales: item.total || 0,
        }))
      : [{ name: "No Data", sales: 0 }];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value}`, "Sales"]}
          labelStyle={{ color: "#666" }}
          contentStyle={{ backgroundColor: "#111", borderRadius: "8px" }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#22c55e" // bright green line
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
