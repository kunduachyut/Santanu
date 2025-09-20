"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Globe, Eye } from "lucide-react";
import type { Website } from "./website-management-table";

interface WebsiteSearchBarProps {
  websites: Website[];
  onSearch: (filteredWebsites: Website[]) => void;
}

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function WebsiteSearchBar({ websites, onSearch }: WebsiteSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const filteredWebsites = useMemo(() => {
    if (!debouncedQuery) {
      return websites;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    return websites.filter(website => {
      const titleMatch = website.title?.toLowerCase().includes(normalizedQuery);
      const urlMatch = website.url?.toLowerCase().includes(normalizedQuery);
      return titleMatch || urlMatch;
    });
  }, [websites, debouncedQuery]);

  useEffect(() => {
    onSearch(filteredWebsites);
  }, [filteredWebsites, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          duration: 0.4,
        },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <div className="relative">
          <Input
            id="website-search"
            type="text"
            placeholder="Search by domain name or website title..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-3 pr-9 py-2 h-10 text-sm rounded-lg focus-visible:ring-offset-0 w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
            <AnimatePresence mode="popLayout">
              {query.length > 0 ? (
                <motion.div
                  key="send"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            className="w-full border rounded-md shadow-sm overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.div>
              {filteredWebsites.slice(0, 5).map((website) => (
                <motion.div
                  key={website._id}
                  className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer"
                  variants={item}
                  layout
                  onClick={() => {
                    setQuery(website.title || website.url || "");
                    setIsFocused(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {website.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {website.url}
                      </div>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </motion.div>
              ))}
              {filteredWebsites.length === 0 && (
                <motion.div
                  className="px-3 py-4 text-center text-gray-500"
                  variants={item}
                >
                  No websites found matching "{query}"
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}