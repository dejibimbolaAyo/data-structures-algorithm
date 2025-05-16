import { useState, useCallback } from "react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "@remix-run/react";

import { MenuItem } from "@components/MenuItem";
import menuData from "@data/menu.json";

interface MenuItemType {
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

export function Menu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const isActive = useCallback(
    (item: MenuItemType) => {
      const currentPath = location.pathname.replace("/structure/", "");

      // Check if current path matches item id
      if (item.id === currentPath) return true;

      // Check items array
      if (item.items) {
        return item.items.some((subItem) => {
          const id =
            typeof subItem === "string"
              ? subItem.toLowerCase().replace(/\s+/g, "-")
              : subItem.id;
          return id === currentPath;
        });
      }

      // Check subcategories
      if (item.subcategories) {
        return item.subcategories.some((subcategory) => {
          return subcategory.items.some((subItem) => {
            const id =
              typeof subItem === "string"
                ? subItem.toLowerCase().replace(/\s+/g, "-")
                : subItem.id;
            return id === currentPath;
          });
        });
      }

      return false;
    },
    [location.pathname]
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-emerald-50 dark:bg-emerald-1000 shadow-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-emerald-700 dark:text-emerald-100" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-emerald-700 dark:text-emerald-100" />
        )}
      </button>

      {/* Menu */}
      <nav
        className={`
          fixed lg:static
          w-80 h-full
          bg-emerald-50 dark:bg-emerald-1000 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          z-40
          flex flex-col
        `}
      >
        {/* Header - Fixed */}
        <div className="p-4 pt-16 lg:pt-4 border-b border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-950">
          <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-50">
            Data Structures
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {menuData.menuItems.map((item) => (
              <MenuItem key={item.id} item={item} isActive={isActive(item)} />
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-emerald-950 bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
