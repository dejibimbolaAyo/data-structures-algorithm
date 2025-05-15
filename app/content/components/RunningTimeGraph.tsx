import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ComplexityType =
  | "O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n^2)"
  | "O(2^n)";

export function generateGrowthData(
  complexity: ComplexityType,
  maxN: number = 100,
  step: number = 5
) {
  const data = [];
  for (let n = 1; n <= maxN; n += step) {
    let time: number;
    switch (complexity) {
      case "O(1)":
        time = 1;
        break;
      case "O(log n)":
        time = Math.log2(n);
        break;
      case "O(n)":
        time = n;
        break;
      case "O(n log n)":
        time = n * Math.log2(n);
        break;
      case "O(n^2)":
        time = n * n;
        break;
      case "O(2^n)":
        time = Math.pow(2, n);
        break;
      default:
        time = n;
    }
    data.push({ n, time: Number(time.toFixed(2)) });
  }
  return data;
}

type Props = {
  label: string;
  complexityType: ComplexityType;
  maxN?: number;
  step?: number;
};

export function RunningTimeGraph({
  label,
  complexityType,
  maxN = 100,
  step = 5,
}: Readonly<Props>) {
  const data = generateGrowthData(complexityType, maxN, step);
  return (
    <div className="my-6">
      <h3 className="mb-2 text-sm font-semibold">{label} Growth</h3>
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

RunningTimeGraph.generateGrowthData = generateGrowthData;
