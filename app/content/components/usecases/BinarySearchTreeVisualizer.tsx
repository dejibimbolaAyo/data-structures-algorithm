import React, { useState } from "react";

import { Mermaid } from "../Mermaid";

export type BinaryTreeNode<T = string> = {
  value: T;
  left?: BinaryTreeNode<T>;
  right?: BinaryTreeNode<T>;
};

export const sampleTree: BinaryTreeNode = {
  value: "50",
  left: {
    value: "30",
    left: { value: "20" },
    right: { value: "40" },
  },
  right: {
    value: "70",
    left: { value: "60" },
    right: { value: "80" },
  },
};

type Props = {
  node?: BinaryTreeNode;
  onNodeClick?: (node: BinaryTreeNode) => void;
  selectedNode?: BinaryTreeNode;
};

const insertNode = (root: BinaryTreeNode, value: string): BinaryTreeNode => {
  if (!root) return { value };

  const numValue = parseInt(value);
  const rootValue = parseInt(root.value);

  if (numValue < rootValue) {
    root.left = insertNode(root.left || { value }, value);
  } else if (numValue > rootValue) {
    root.right = insertNode(root.right || { value }, value);
  }

  return root;
};

const deleteNode = (
  root: BinaryTreeNode,
  value: string
): BinaryTreeNode | undefined => {
  if (!root) return undefined;

  const numValue = parseInt(value);
  const rootValue = parseInt(root.value);

  if (numValue < rootValue) {
    root.left = deleteNode(root.left || { value }, value);
  } else if (numValue > rootValue) {
    root.right = deleteNode(root.right || { value }, value);
  } else {
    // Node to delete found
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    // Node has two children
    const minValue = findMinValue(root.right);
    root.value = minValue;
    root.right = deleteNode(root.right, minValue);
  }

  return root;
};

const findMinValue = (node: BinaryTreeNode): string => {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current.value;
};

const searchNode = (
  root: BinaryTreeNode,
  value: string
): BinaryTreeNode | undefined => {
  if (!root) return undefined;

  const numValue = parseInt(value);
  const rootValue = parseInt(root.value);

  if (rootValue === numValue) return root;

  if (numValue < rootValue) {
    return searchNode(root.left || { value }, value);
  }

  return searchNode(root.right || { value }, value);
};

const findNodePosition = (root: BinaryTreeNode, target: string): string[] => {
  const path: string[] = [];

  const search = (node: BinaryTreeNode, value: string): boolean => {
    if (!node) return false;

    const numValue = parseInt(value);
    const nodeValue = parseInt(node.value);

    if (nodeValue === numValue) return true;

    if (numValue < nodeValue) {
      path.push("left");
      if (search(node.left || { value }, value)) return true;
      path.pop();
    } else {
      path.push("right");
      if (search(node.right || { value }, value)) return true;
      path.pop();
    }

    return false;
  };

  search(root, target);
  return path;
};

const generateMermaidCode = (
  node: BinaryTreeNode,
  searchResult?: BinaryTreeNode
): string => {
  let code = "graph TD\n";

  const addNode = (node: BinaryTreeNode, parentId?: string) => {
    const nodeId = `node_${node.value}`;
    const isSearchResult = searchResult?.value === node.value;
    code += `    ${nodeId}(("${node.value}")):::${
      isSearchResult ? "searchResult" : "normal"
    }\n`;

    if (parentId) {
      code += `    ${parentId} --> ${nodeId}\n`;
    }

    if (node.left) {
      addNode(node.left, nodeId);
    }
    if (node.right) {
      addNode(node.right, nodeId);
    }
  };

  addNode(node);

  // Add styles for search result
  code += `
    classDef normal fill:#f3f4f6,stroke:#6b7280,stroke-width:2px
    classDef searchResult fill:#4ade80,stroke:#22c55e,stroke-width:4px
  `;

  return code;
};

export const BinarySearchTreeVisualizer: React.FC<Props> = ({
  node = sampleTree,
  onNodeClick,
  selectedNode,
}) => {
  const [tree, setTree] = useState<BinaryTreeNode>(node);
  const [newValue, setNewValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<
    BinaryTreeNode | undefined
  >();
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInsert = () => {
    if (!newValue.trim()) {
      showMessage("Please enter a number", "error");
      return;
    }
    const numValue = parseInt(newValue);
    if (isNaN(numValue)) {
      showMessage("Please enter a valid number", "error");
      return;
    }
    setTree(insertNode({ ...tree }, newValue));
    setNewValue("");
    showMessage(`Inserted ${newValue} into the tree`, "success");
  };

  const handleDelete = () => {
    if (!newValue.trim()) {
      showMessage("Please enter a number", "error");
      return;
    }
    const numValue = parseInt(newValue);
    if (isNaN(numValue)) {
      showMessage("Please enter a valid number", "error");
      return;
    }
    const newTree = deleteNode({ ...tree }, newValue);
    if (newTree) {
      setTree(newTree);
      showMessage(`Deleted ${newValue} from the tree`, "success");
    } else {
      showMessage(`Value ${newValue} not found in tree`, "error");
    }
    setNewValue("");
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      showMessage("Please enter a number to search", "error");
      return;
    }
    const numValue = parseInt(searchValue);
    if (isNaN(numValue)) {
      showMessage("Please enter a valid number", "error");
      return;
    }
    setIsSearching(true);
    setSearchResult(undefined);

    // Simulate search animation
    setTimeout(() => {
      const result = searchNode(tree, searchValue);
      setSearchResult(result);
      setIsSearching(false);
      if (!result) {
        showMessage(`Value ${searchValue} not found in tree`, "error");
      } else {
        showMessage(`Found value ${searchValue} in tree`, "success");
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-16 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            message.type === "success"
              ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100"
              : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Insert/Delete Controls */}
          <div className="space-y-4 p-4 bg-white dark:bg-emerald-900 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-50 flex items-center gap-2">
              <span>Modify Tree</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                (Press Enter to submit)
              </span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleInsert)}
                placeholder="Enter number"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-emerald-800 dark:border-emerald-700 dark:text-emerald-50"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleInsert}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  Insert
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Search Controls */}
          <div className="space-y-4 p-4 bg-white dark:bg-emerald-900 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-50 flex items-center gap-2">
              <span>Search Tree</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                (Press Enter to search)
              </span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSearch)}
                placeholder="Search number"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-emerald-800 dark:border-emerald-700 dark:text-emerald-50"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`shrink-0 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700 ${
                  isSearching ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Tree Visualization */}
        <div className="space-y-6">
          {/* Main Tree Graph */}
          <div className="p-6 bg-white dark:bg-emerald-900 rounded-lg shadow-lg">
            <div className="relative overflow-hidden rounded-lg">
              {/* Zoom Controls */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-emerald-800/90 backdrop-blur-sm rounded-lg shadow-sm p-1 z-10">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-700 rounded transition-colors"
                  title="Zoom Out"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={resetZoom}
                  className="px-1.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-700 rounded transition-colors"
                  title="Reset Zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-700 rounded transition-colors"
                  title="Zoom In"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {isSearching && (
                <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="animate-pulse text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Searching...
                  </div>
                </div>
              )}
              <div
                className="cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center",
                  transition: isDragging
                    ? "none"
                    : "transform 0.2s ease-in-out",
                }}
              >
                <Mermaid chart={generateMermaidCode(tree, searchResult)} />
              </div>
            </div>
          </div>

          {/* Trail Visualization */}
          <div className="p-6 bg-white dark:bg-emerald-900 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-50 mb-4">
              Search Trail
            </h3>
            <div className="min-h-[100px]">
              {searchResult ? (
                <Mermaid
                  chart={`
                  graph LR
                    ${findNodePosition(tree, searchResult.value)
                      .map(
                        (direction, index) => `
                      node_${index}(("${direction}")):::trail
                      ${index > 0 ? `node_${index - 1} --> node_${index}` : ""}
                    `
                      )
                      .join("\n")}
                    
                    classDef trail fill:#fef3c7,stroke:#d97706,stroke-width:2px
                `}
                />
              ) : (
                <div className="flex items-center justify-center h-[100px] text-emerald-400 dark:text-emerald-500">
                  {isSearching ? "Searching..." : "No search performed yet"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
