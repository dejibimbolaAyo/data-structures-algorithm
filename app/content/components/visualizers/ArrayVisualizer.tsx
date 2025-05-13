import { useState, useRef } from "react";

import clsx from "clsx";

import { OperationPerformanceGraph } from "@/content/components/OperationPerformanceGraph";

const runningTimes: Record<string, string> = {
  access: "O(1)",
  search: "O(n)",
  insert: "O(n)",
  delete: "O(n)",
};

type TimePoint = { n: number; time: number };

// Utility to update or add a time point for a given n
function upsertTime(times: TimePoint[], n: number, time: number): TimePoint[] {
  const idx = times.findIndex((tp) => tp.n === n);
  if (idx !== -1) {
    // Replace the existing entry
    const updated = [...times];
    updated[idx] = { n, time };
    return updated;
  }
  // Add new entry
  return [...times, { n, time }];
}

export function ArrayVisualizer({
  initial = [1, 2, 3, 4, 5],
}: Readonly<{ initial?: number[] }>) {
  const [array, setArray] = useState(initial);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputIndex, setInputIndex] = useState("");
  const [message, setMessage] = useState("");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [lastOp, setLastOp] = useState<string | null>(null);

  // Store running time data for each operation
  const [accessTimes, setAccessTimes] = useState<TimePoint[]>([]);
  const [searchTimes, setSearchTimes] = useState<TimePoint[]>([]);
  const [insertTimes, setInsertTimes] = useState<TimePoint[]>([]);
  const [deleteTimes, setDeleteTimes] = useState<TimePoint[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Helper to animate highlight
  const animate = (index: number, cb: () => void) => {
    setHighlight(index);
    setTimeout(() => {
      setHighlight(null);
      cb();
    }, 700);
  };

  // Access
  const handleAccess = () => {
    const idx = Number(inputIndex);
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setMessage("Invalid index");
      setElapsed(null);
      setLastOp("access");
      return;
    }
    const t0 = performance.now();
    animate(idx, () => {
      const t1 = performance.now();
      setMessage(`Accessed value: ${array[idx]}`);
      setElapsed(t1 - t0);
      setLastOp("access");
      setAccessTimes((times) => upsertTime(times, array.length, t1 - t0));
    });
  };

  // Search
  const handleSearch = () => {
    const val = Number(inputValue);
    const t0 = performance.now();
    const idx = array.indexOf(val);
    const t1 = performance.now();
    if (idx === -1) {
      setMessage("Value not found");
      setHighlight(null);
      setElapsed(t1 - t0);
      setLastOp("search");
      setSearchTimes((times) => upsertTime(times, array.length, t1 - t0));
      return;
    }
    animate(idx, () => {
      setMessage(`Found at index: ${idx}`);
      setElapsed(t1 - t0);
      setLastOp("search");
      setSearchTimes((times) => upsertTime(times, array.length, t1 - t0));
    });
  };

  // Insert
  const handleInsert = () => {
    const idx = Number(inputIndex);
    const val = Number(inputValue);
    if (isNaN(idx) || idx < 0 || idx > array.length || isNaN(val)) {
      setMessage("Invalid index or value");
      setElapsed(null);
      setLastOp("insert");
      return;
    }
    const t0 = performance.now();
    setArray((arr) => {
      const newArr = [...arr];
      newArr.splice(idx, 0, val);
      return newArr;
    });
    const t1 = performance.now();
    animate(idx, () => {
      setMessage(`Inserted ${val} at index ${idx}`);
      setElapsed(t1 - t0);
      setLastOp("insert");
      setInsertTimes((times) => upsertTime(times, array.length + 1, t1 - t0));
    });
  };

  // Delete
  const handleDelete = () => {
    const idx = Number(inputIndex);
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setMessage("Invalid index");
      setElapsed(null);
      setLastOp("delete");
      return;
    }
    const t0 = performance.now();
    setArray((arr) => {
      const newArr = [...arr];
      newArr.splice(idx, 1);
      return newArr;
    });
    const t1 = performance.now();
    animate(idx, () => {
      setMessage(`Deleted at index ${idx}`);
      setElapsed(t1 - t0);
      setLastOp("delete");
      setDeleteTimes((times) => upsertTime(times, array.length - 1, t1 - t0));
    });
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 items-end">
        <div>
          <span className="block text-xs">Value</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
        <div>
          <span className="block text-xs">Index</span>
          <input
            type="number"
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
        <button
          onClick={handleAccess}
          className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
        >
          Access
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={handleInsert}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          Insert
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
      <section
        ref={scrollRef}
        tabIndex={0}
        aria-label="Array visualizer"
        aria-roledescription="scrollable"
        className={clsx(
          "flex gap-2 py-4 overflow-x-scroll w-full px-8 cursor-grab active:cursor-grabbing",
          array.length > 10
            ? "max-w-[100vw]"
            : "justify-center max-w-[calc(100vw-1rem)]"
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ userSelect: isDragging.current ? "none" : "auto" }}
      >
        {array.map((val, idx) => (
          <div
            key={`${val}-${idx}`}
            className={clsx(
              "min-w-[3rem] h-12 flex-shrink-0 flex items-center justify-center border-2 rounded transition-all duration-500 text-lg font-mono",
              highlight === idx
                ? "bg-emerald-200 border-emerald-600 scale-110 shadow-lg dark:bg-emerald-900 dark:border-emerald-400"
                : "bg-zinc-200 border-zinc-700 dark:bg-zinc-800 dark:border-zinc-600"
            )}
            style={{ transition: "all 0.5s cubic-bezier(.4,2,.6,1)" }}
          >
            {val}
          </div>
        ))}
      </section>
      <div className="text-center text-sm text-slate-500 dark:text-slate-300">
        {message}
        {lastOp && (
          <div>
            <span className="ml-2">
              <b>Running time:</b> {runningTimes[lastOp]}{" "}
              {elapsed !== null && (
                <span className="ml-2">
                  <b>Measured:</b> {elapsed.toFixed(4)} ms
                </span>
              )}
            </span>
          </div>
        )}
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-200 text-center">
        <b>Note:</b> The measured running time is for visualization only and
        depends on your device and browser. It does not represent the true
        theoretical complexity.
      </div>
      <OperationPerformanceGraph
        accessTimes={accessTimes}
        searchTimes={searchTimes}
        insertTimes={insertTimes}
        deleteTimes={deleteTimes}
      />
    </div>
  );
}
