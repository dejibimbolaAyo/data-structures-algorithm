import { useState } from "react";

import { ChevronDownIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  items?: Array<{ id: string; title: string; enabled: boolean } | string>;
  subcategories?: Array<{
    id: string;
    title: string;
    items: Array<{ id: string; title: string; enabled: boolean } | string>;
  }>;
}

interface MenuItemProps {
  item: MenuItem;
  isActive?: boolean;
}

function Subcategory({
  subcategory,
}: {
  subcategory: {
    id: string;
    title: string;
    items: Array<{ id: string; title: string; enabled: boolean } | string>;
  };
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className="w-full text-left p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`subcategory-${subcategory.id}`}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
            {subcategory.title}
          </h4>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`subcategory-${subcategory.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 space-y-1">
              {subcategory.items.map((subItem) => {
                const id =
                  typeof subItem === "string"
                    ? subItem.toLowerCase().replace(/\s+/g, "-")
                    : subItem.id;
                const title =
                  typeof subItem === "string" ? subItem : subItem.title;
                const enabled =
                  typeof subItem === "string" ? true : subItem.enabled;

                return (
                  <div
                    key={id}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg
                      ${
                        enabled
                          ? "hover:bg-emerald-100 dark:hover:bg-emerald-900"
                          : "opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    {!enabled && (
                      <LockClosedIcon className="h-3 w-3 text-emerald-700 dark:text-emerald-300" />
                    )}
                    {enabled ? (
                      <Link
                        to={`/structure/${id}`}
                        className="text-emerald-700 dark:text-emerald-300"
                      >
                        {title}
                      </Link>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-300">
                        {title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MenuItem({ item, isActive }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = item.subcategories && item.subcategories.length > 0;
  const hasDirectItems = item.items && item.items.length > 0;

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (hasSubcategories || hasDirectItems) {
        setIsExpanded(!isExpanded);
      }
    }
  };

  return (
    <div className="space-y-1">
      {/* Main Category */}
      <button
        type="button"
        className={`
          w-full text-left p-2 rounded-lg
          ${
            hasSubcategories || hasDirectItems
              ? "hover:bg-emerald-100 dark:hover:bg-emerald-900"
              : ""
          }
          ${!item.enabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isActive ? "bg-emerald-100 dark:bg-emerald-900" : ""}
        `}
        onClick={() => {
          if ((hasSubcategories || hasDirectItems) && item.enabled) {
            setIsExpanded(!isExpanded);
          }
        }}
        onKeyPress={handleKeyPress}
        aria-expanded={isExpanded}
        aria-controls={`submenu-${item.id}`}
        disabled={!item.enabled}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!item.enabled && (
              <LockClosedIcon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            )}
            <div>
              <h3
                className={`font-medium ${
                  isActive
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-emerald-900 dark:text-emerald-50"
                }`}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          {(hasSubcategories || hasDirectItems) && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            </motion.div>
          )}
        </div>
      </button>

      {/* Subcategories and Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`submenu-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 space-y-2">
              {/* Direct Items */}
              {hasDirectItems &&
                item.items?.map((subItem) => {
                  const id =
                    typeof subItem === "string"
                      ? subItem.toLowerCase().replace(/\s+/g, "-")
                      : subItem.id;
                  const title =
                    typeof subItem === "string" ? subItem : subItem.title;
                  const enabled =
                    typeof subItem === "string" ? true : subItem.enabled;

                  return (
                    <div
                      key={id}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg
                        ${
                          enabled
                            ? "hover:bg-emerald-100 dark:hover:bg-emerald-900"
                            : "opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      {!enabled && (
                        <LockClosedIcon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                      )}
                      {enabled ? (
                        <Link
                          to={`/structure/${id}`}
                          className="text-emerald-700 dark:text-emerald-300"
                        >
                          {title}
                        </Link>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-300">
                          {title}
                        </span>
                      )}
                    </div>
                  );
                })}

              {/* Subcategories */}
              {hasSubcategories &&
                item.subcategories?.map((subcategory) => (
                  <Subcategory key={subcategory.id} subcategory={subcategory} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
