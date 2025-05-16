import React, { useState, useRef } from "react";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

export const smallStructure: FileNode = {
  name: "root",
  type: "folder",
  children: [
    { name: "index.tsx", type: "file" },
    { name: "App.tsx", type: "file" },
    {
      name: "components",
      type: "folder",
      children: [
        { name: "Button.tsx", type: "file" },
        { name: "Header.tsx", type: "file" },
      ],
    },
  ],
};

export const largeStructure: FileNode = {
  name: "project",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "main.ts", type: "file" },
        {
          name: "pages",
          type: "folder",
          children: [
            { name: "Home.tsx", type: "file" },
            { name: "About.tsx", type: "file" },
            { name: "Contact.tsx", type: "file" },
          ],
        },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "Navbar.tsx", type: "file" },
            { name: "Sidebar.tsx", type: "file" },
            { name: "Card.tsx", type: "file" },
          ],
        },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "index.html", type: "file" },
        { name: "favicon.ico", type: "file" },
      ],
    },
    {
      name: "tests",
      type: "folder",
      children: [
        { name: "App.test.tsx", type: "file" },
        { name: "Navbar.test.tsx", type: "file" },
      ],
    },
    { name: "README.md", type: "file" },
    { name: ".gitignore", type: "file" },
  ],
};

type Props = {
  type?: "small" | "large";
  level?: number;
  node?: FileNode;
  title?: string;
  onAddNode?: (parentNode: FileNode, newNode: FileNode) => void;
};

// Create a Map to store folder states
const folderStates = new Map<string, boolean>();

export const NAryFolder: React.FC<Props> = ({
  type = "small",
  level = 0,
  node,
  title,
  onAddNode,
}) => {
  const currentNode =
    node || (type === "small" ? smallStructure : largeStructure);
  const isFolder = currentNode.type === "folder";
  const nodeId = `${currentNode.name}-${level}`;

  const [isOpen, setIsOpen] = useState(() => folderStates.get(nodeId) ?? true);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeType, setNewNodeType] = useState<"file" | "folder">("file");
  const [isHovered, setIsHovered] = useState(false);
  const [height, setHeight] = useState<number | "auto">("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (isFolder) {
      const newState = !isOpen;
      setIsOpen(newState);
      folderStates.set(nodeId, newState);

      if (contentRef.current) {
        if (newState) {
          // When opening, first set height to 0
          setHeight(0);
          // Then in the next frame, set to the actual height
          requestAnimationFrame(() => {
            setHeight(contentRef.current?.scrollHeight || "auto");
          });
        } else {
          // When closing, set height to current height
          setHeight(contentRef.current.scrollHeight);
          // Then in the next frame, set to 0
          requestAnimationFrame(() => {
            setHeight(0);
          });
        }
      }
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const newNode: FileNode = {
      name: newNodeName,
      type: newNodeType,
      children: newNodeType === "folder" ? [] : undefined,
    };

    if (onAddNode) {
      onAddNode(currentNode, newNode);
    } else {
      if (!currentNode.children) {
        currentNode.children = [];
      }
      currentNode.children.push(newNode);
    }

    setIsOpen(true);
    folderStates.set(nodeId, true);
    setNewNodeName("");
    setIsAdding(false);
  };

  return (
    <div>
      {level === 0 && title && (
        <h3 className="text-xl font-bold mb-6 text-emerald-900 dark:text-emerald-50">
          {title}
        </h3>
      )}
      <div
        style={{ paddingLeft: level * 20 }}
        className="transition-all duration-300 ease-in-out"
      >
        <div
          className={`
            flex items-center gap-2 py-1 px-2 rounded-md
            ${
              isFolder ? "hover:bg-emerald-50 dark:hover:bg-emerald-900/50" : ""
            }
            transition-colors duration-200
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={toggle}
            onKeyDown={(e) => e.key === "Enter" && toggle()}
            className={`
              flex items-center gap-2
              ${isFolder ? "cursor-pointer" : "cursor-default"}
              ${
                isFolder
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-gray-600 dark:text-gray-400"
              }
              transition-colors duration-200
            `}
          >
            <span className="text-lg transition-transform duration-300 ease-in-out">
              {isFolder ? (isOpen ? "📂" : "📁") : "📄"}
            </span>
            <span
              className={`
              font-medium
              ${isFolder ? "font-semibold" : "font-normal"}
            `}
            >
              {currentNode.name}
            </span>
          </button>

          {isFolder && (
            <button
              type="button"
              onClick={() => {
                setIsAdding(true);
                setIsOpen(true);
                folderStates.set(nodeId, true);
                if (contentRef.current) {
                  setHeight(contentRef.current.scrollHeight);
                }
              }}
              className={`
                text-emerald-600 hover:text-emerald-700 
                dark:text-emerald-400 dark:hover:text-emerald-300
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                ${isHovered ? "opacity-100" : "opacity-0"}
                text-lg font-bold
              `}
              title="Add new node"
            >
              +
            </button>
          )}
        </div>

        {isAdding && isFolder && (
          <form
            onSubmit={handleAddNode}
            className="ml-8 mt-2 space-y-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"
          >
            <div className="space-y-2">
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-3 py-2 border rounded-md 
                  bg-white dark:bg-emerald-900 
                  border-emerald-200 dark:border-emerald-700
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  dark:focus:ring-emerald-400"
              />
              <select
                value={newNodeType}
                onChange={(e) =>
                  setNewNodeType(e.target.value as "file" | "folder")
                }
                className="w-full px-3 py-2 border rounded-md
                  bg-white dark:bg-emerald-900 
                  border-emerald-200 dark:border-emerald-700
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  dark:focus:ring-emerald-400"
              >
                <option value="file">File</option>
                <option value="folder">Folder</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium
                  bg-emerald-600 text-white rounded-md
                  hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500
                  dark:bg-emerald-500 dark:hover:bg-emerald-600
                  transition-colors duration-200"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium
                  bg-gray-100 text-gray-700 rounded-md
                  hover:bg-gray-200 focus:ring-2 focus:ring-gray-500
                  dark:bg-emerald-800 dark:text-emerald-100 
                  dark:hover:bg-emerald-700
                  transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div
          ref={contentRef}
          style={{
            height,
            overflow: "hidden",
            transition: "height 300ms ease-in-out",
          }}
        >
          {currentNode.children && (
            <div className="transition-all duration-300 ease-in-out">
              {currentNode.children.map((child, idx) => (
                <NAryFolder
                  key={idx}
                  node={child}
                  level={level + 1}
                  onAddNode={onAddNode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
