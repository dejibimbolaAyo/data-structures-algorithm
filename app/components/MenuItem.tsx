import { useState } from "react";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

interface MenuItem {
  id: string;
  title: string;
  enabled?: boolean;
}

interface SubCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

interface MenuItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    enabled?: boolean;
    items?: MenuItem[];
    subcategories?: SubCategory[];
  };
}

export function MenuItem({ item }: Readonly<MenuItemProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = item.items || item.subcategories;
  const isEnabled = item.enabled !== false;

  return (
    <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden bg-white dark:bg-emerald-950">
      <button
        type="button"
        onClick={() => isEnabled && setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors
          ${
            isEnabled
              ? "hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer"
              : "opacity-60 cursor-not-allowed"
          }`}
      >
        <div className="flex items-center gap-2">
          {!isEnabled && (
            <LockClosedIcon className="h-4 w-4 text-emerald-700 dark:text-emerald-200" />
          )}
          <div>
            <h3
              className={`font-semibold ${
                isEnabled
                  ? "text-emerald-900 dark:text-emerald-50"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`text-sm ${
                isEnabled
                  ? "text-emerald-700 dark:text-emerald-200"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {item.description}
            </p>
          </div>
        </div>
        {hasSubItems &&
          isEnabled &&
          (isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          ))}
      </button>

      {isExpanded && hasSubItems && isEnabled && (
        <div className="border-t border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-1000">
          {item.subcategories ? (
            <div className="divide-y divide-emerald-200 dark:divide-emerald-800">
              {item.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="p-3">
                  <h4 className="font-semibold text-sm mb-2 text-emerald-900 dark:text-emerald-50">
                    {subcategory.title}
                  </h4>
                  <ul className="pl-4 space-y-2">
                    {subcategory.items.map((subItem) => (
                      <li key={subItem.id}>
                        {subItem.enabled !== false ? (
                          <Link
                            to={`/structure/${encodeURIComponent(subItem.id)}`}
                            className="block text-sm text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2 py-1 rounded transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 px-2 py-1 text-sm text-emerald-600 dark:text-emerald-400 opacity-60">
                            <LockClosedIcon className="h-3 w-3" />
                            <span>{subItem.title}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="p-3 space-y-2">
              {item.items?.map((subItem) => (
                <li key={subItem.id}>
                  {subItem.enabled !== false ? (
                    <Link
                      to={`/structure/${encodeURIComponent(subItem.id)}`}
                      className="block text-sm text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2 py-1 rounded transition-colors"
                    >
                      {subItem.title}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-emerald-600 dark:text-emerald-400 opacity-60">
                      <LockClosedIcon className="h-3 w-3" />
                      <span>{subItem.title}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
