import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = { n: number; time: number };
type Props = {
  data: DataPoint[];
  label: string;
};

export function PerformanceTimeGraph({ data, label }: Readonly<Props>) {
  return (
    <div className="my-6">
      <h3 className="mb-2 text-sm font-semibold">{label}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="n"
            label={{
              value: "Input Size (n)",
              position: "insideBottomRight",
              offset: 0,
            }}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="time"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
