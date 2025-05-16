import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { LinkedList } from "@/content/components/structure/LinkedList";

const list = new LinkedList();

interface LinkedListVisualizerProps {
  title?: string;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  title = "Linked List Visualizer",
}) => {
  const [input, setInput] = useState("");
  const [nodes, setNodes] = useState<string[]>([]);
  const maxListSize = 10;

  const refreshList = () => {
    setNodes([...list.toArray()]);
  };

  const handleInsertEnd = () => {
    if (input.trim() && nodes.length < maxListSize) {
      list.insertAtEnd(input);
      setInput("");
      refreshList();
    }
  };

  const handleInsertHead = () => {
    if (input.trim() && nodes.length < maxListSize) {
      list.insertAtHead(input);
      setInput("");
      refreshList();
    }
  };

  const handleDeleteHead = () => {
    list.deleteFromHead();
    refreshList();
  };

  const handleDeleteByValue = () => {
    list.deleteByValue(input);
    setInput("");
    refreshList();
  };

  const handleReverse = () => {
    list.reverse();
    refreshList();
  };

  const handleClear = () => {
    while (list.head) {
      list.deleteFromHead();
    }
    refreshList();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-2">
        <input
          className="border px-3 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Node value"
          disabled={nodes.length >= maxListSize}
        />
        <button
          onClick={handleInsertHead}
          disabled={!input.trim() || nodes.length >= maxListSize}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Insert at Head
        </button>
        <button
          onClick={handleInsertEnd}
          disabled={!input.trim() || nodes.length >= maxListSize}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Insert at Tail
        </button>
        <button
          onClick={handleDeleteHead}
          disabled={nodes.length === 0}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete Head
        </button>
        <button
          onClick={handleReverse}
          disabled={nodes.length <= 1}
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Reverse List
        </button>
        <button
          onClick={handleDeleteByValue}
          disabled={!input.trim() || nodes.length === 0}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Delete by Value
        </button>
        <button
          onClick={handleClear}
          disabled={nodes.length === 0}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center space-x-4 p-4 border rounded overflow-x-auto bg-gray-50">
        <AnimatePresence initial={false}>
          {nodes.map((value, index) => (
            <motion.div
              key={value + "-" + index}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div
                className={`w-32 h-10 rounded-md flex items-center justify-center shadow-md text-white ${
                  index % 4 === 0
                    ? "bg-blue-500"
                    : index % 4 === 1
                    ? "bg-purple-500"
                    : index % 4 === 2
                    ? "bg-green-500"
                    : "bg-orange-500"
                }`}
              >
                {value}
              </div>
              {index < nodes.length - 1 && (
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-lg">
                  ➡️
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-sm text-gray-500">
        {nodes.length === 0
          ? "List is empty"
          : `List size: ${nodes.length}/${maxListSize}`}
      </div>
    </div>
  );
};
