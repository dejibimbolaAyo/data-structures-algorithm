import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

const StackBox: React.FC<{ title: string; items: string[] }> = ({
  title,
  items,
}) => (
  <div className="flex flex-col items-center">
    <div className="text-sm font-semibold mb-1">{title}</div>
    <div className="flex flex-col-reverse items-center gap-2 min-h-[200px]">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item + index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
            className="w-32 h-10 bg-indigo-500 text-white rounded-md flex items-center justify-center shadow-md"
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    <div className="text-xs mt-1 text-gray-500">Top ↑</div>
  </div>
);

export const UndoRedoTextEditor: React.FC = () => {
  const [text, setText] = useState("");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setUndoStack([...undoStack, text]); // store current before changing
    setRedoStack([]);
    setText(newText);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setRedoStack([text, ...redoStack]);
    setUndoStack(undoStack.slice(0, -1));
    setText(last);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack([...undoStack, text]);
    setRedoStack(redoStack.slice(1));
    setText(next);
  };

  const handleClear = () => {
    setUndoStack([]);
    setRedoStack([]);
    setText("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✍️ Undo/Redo Stack Visualizer</h1>

      <input
        type="text"
        value={text}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        placeholder="Type something..."
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          disabled={undoStack.length === 0}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={redoStack.length === 0}
        >
          Redo
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <StackBox title="Undo Stack" items={undoStack} />
        <StackBox title="Redo Stack" items={redoStack} />
      </div>
    </div>
  );
};
