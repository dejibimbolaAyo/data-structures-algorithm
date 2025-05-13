import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateGrowthData, ComplexityType } from "@/lib/generatateGrowthData";

import { RunningTimeGraph } from "./RunningTimeGraph";

const complexities: ComplexityType[] = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n^2)",
  "O(2^n)",
];

export function InteractiveRunningTimeGraph() {
  const [selected, setSelected] = useState<ComplexityType>("O(n)");
  const [maxN, setMaxN] = useState(100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <span className="mr-2">Complexity:</span>
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as ComplexityType)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {complexities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <span className="mr-2">Max n:</span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={selected === "O(2^n)" ? 20 : 1000}
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20 bg-inherit"
            />
          </span>
        </div>
      </div>
      <RunningTimeGraph
        label={`${selected} Growth`}
        data={generateGrowthData(selected, maxN)}
      />
    </div>
  );
}
