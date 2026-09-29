"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryData;
    const formattedAmount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(data.amount);

    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-md backdrop-blur-md">
        <p className="text-sm font-semibold text-popover-foreground">
          {data.category}
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          {formattedAmount}
        </p>
      </div>
    );
  }

  return null;
};

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  title = "Gastos por Categoria",
}) => {
  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, item) => acc + item.amount, 0);
  }, [data]);

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Nenhuma transação registrada.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                  stroke="transparent"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => {
                    const item = data.find((d) => d.category === value);
                    const percentage = item && totalAmount > 0
                      ? ((item.amount / totalAmount) * 100).toFixed(0)
                      : 0;
                    return (
                      <span className="text-xs font-medium text-muted-foreground">
                        {value} ({percentage}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default CategoryChart;
