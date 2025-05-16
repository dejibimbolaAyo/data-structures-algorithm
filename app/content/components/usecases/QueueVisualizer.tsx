import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

interface QueueItem {
  id: number;
  label: string;
}

interface QueueVisualizerProps {
  title?: string;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  title = "Queue Visualizer (FIFO)",
}) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const maxQueueSize = 10;

  const enqueue = () => {
    if (input.trim() && queue.length < maxQueueSize) {
      setQueue([...queue, { id: Date.now(), label: input }]);
      setInput("");
    }
  };

  const dequeue = async () => {
    if (queue.length === 0 || processing) return;
    setProcessing(true);

    await new Promise((res) => setTimeout(res, 1000)); // simulate processing
    setQueue((prev) => prev.slice(1));

    setProcessing(false);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
          disabled={queue.length >= maxQueueSize}
        />
        <button
          onClick={enqueue}
          disabled={!input.trim() || queue.length >= maxQueueSize}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Enqueue
        </button>
        <button
          onClick={dequeue}
          disabled={processing || queue.length === 0}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Process (Dequeue)
        </button>
        <button
          onClick={clearQueue}
          disabled={queue.length === 0}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto p-4 border rounded bg-gray-100">
        <AnimatePresence initial={false}>
          {queue.map((item) => (
            <motion.div
              key={item.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-32 h-10 rounded-md flex items-center justify-center shadow-md text-white ${
                item.id % 4 === 0
                  ? "bg-blue-500"
                  : item.id % 4 === 1
                  ? "bg-purple-500"
                  : item.id % 4 === 2
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
            >
              {item.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-sm text-gray-500">
        {queue.length === 0
          ? "Queue is empty"
          : `Queue size: ${queue.length}/${maxQueueSize}`}
      </div>
    </div>
  );
};
