import { useState } from "react";

import { PerformanceTimeGraph } from "@/content/components/PerformanceTimeGraph";

type TimePoint = { n: number; time: number };

type Props = {
  accessTimes: TimePoint[];
  searchTimes: TimePoint[];
  insertTimes: TimePoint[];
  deleteTimes: TimePoint[];
};

const operationLabels: Record<string, string> = {
  access: "Access Time",
  search: "Search Time",
  insert: "Insert Time",
  delete: "Delete Time",
};

export function OperationPerformanceGraph({
  accessTimes,
  searchTimes,
  insertTimes,
  deleteTimes,
}: Readonly<Props>) {
  const [selectedOp, setSelectedOp] =
    useState<keyof typeof operationLabels>("access");

  const opData = {
    access: accessTimes,
    search: searchTimes,
    insert: insertTimes,
    delete: deleteTimes,
  }[selectedOp];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <span className="font-medium">Operation:</span>
        <select
          value={selectedOp}
          onChange={(e) =>
            setSelectedOp(e.target.value as keyof typeof operationLabels)
          }
          className="border rounded px-2 py-1"
        >
          {Object.entries(operationLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <PerformanceTimeGraph
        label={operationLabels[selectedOp]}
        data={[...(opData ?? [])].sort((a, b) => a.n - b.n)}
      />
    </div>
  );
}
