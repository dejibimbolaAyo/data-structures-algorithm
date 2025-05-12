import { useState } from "react";
import { Link } from "@remix-run/react";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface SubCategory {
  id: string;
  title: string;
  items: string[];
}

interface MenuItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    items?: string[];
    subcategories?: SubCategory[];
  };
}

export function MenuItem({ item }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = item.items || item.subcategories;

  return (
    <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden bg-white dark:bg-emerald-950">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center justify-between transition-colors"
      >
        <div>
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-50">
            {item.title}
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-200">
            {item.description}
          </p>
        </div>
        {hasSubItems &&
          (isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          ))}
      </button>

      {isExpanded && hasSubItems && (
        <div className="border-t border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-1000">
          {item.subcategories ? (
            <div className="divide-y divide-emerald-200 dark:divide-emerald-800">
              {item.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="p-3">
                  <h4 className="font-semibold text-sm mb-2 text-emerald-900 dark:text-emerald-50">
                    {subcategory.title}
                  </h4>
                  <ul className="pl-4 space-y-2">
                    {subcategory.items.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={`/structure/${encodeURIComponent(subItem)}`}
                          className="block text-sm text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2 py-1 rounded transition-colors"
                        >
                          {subItem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="p-3 space-y-2">
              {item.items?.map((subItem, index) => (
                <li key={index}>
                  <Link
                    to={`/structure/${encodeURIComponent(subItem)}`}
                    className="block text-sm text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2 py-1 rounded transition-colors"
                  >
                    {subItem}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
