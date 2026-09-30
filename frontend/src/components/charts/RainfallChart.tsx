import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/utils/risk";

export function RainfallChart({
  data,
}: {
  data: { date: string; rainfall: number; normal: number }[];
}) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.map((d) => ({ ...d, label: formatDate(d.date) }))}
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v} mm`, ""]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="rainfall" name="Expected" fill="var(--rain)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="normal" name="Historical normal" fill="var(--muted-foreground)" fillOpacity={0.35} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
