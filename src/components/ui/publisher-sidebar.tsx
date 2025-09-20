"use client";

import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";
import { 
  BarChart, 
  Globe, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  Wallet,
  LogOut,
  User
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

interface PublisherSidebarProps {
  activeTab: "dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings";
  setActiveTab: (tab: "dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings") => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  onCollapseChange?: (collapsed: boolean) => void; // Add onCollapseChange prop
}

export function PublisherSidebar({ 
  activeTab, 
  setActiveTab,
  stats,
  onCollapseChange
}: PublisherSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Notify parent component when collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);
  
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => setActiveTab("dashboard"),
    },
    {
      id: "websites",
      label: "My Websites",
      icon: Globe,
      onClick: () => setActiveTab("websites"),
      badge: stats.total > 0 ? stats.total : undefined,
    },
    {
      id: "add-website",
      label: "Add Website",
      icon: PlusCircle,
      onClick: () => setActiveTab("add-website"),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart,
      onClick: () => setActiveTab("analytics"),
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: Wallet,
      onClick: () => setActiveTab("earnings"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => setActiveTab("settings"),
    },
  ];

  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 top-0 z-40 h-full shrink-0 border-r",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full items-center">
                <motion.li
                  variants={variants}
                  className="flex w-fit items-center gap-2"
                >
                  {!isCollapsed && (
                    <p className="text-sm font-bold text-blue-600">
                      Publisher
                    </p>
                  )}
                </motion.li>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <div className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={cn(
                            "flex h-8 w-full flex-row items-center justify-start rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                            isActive && "bg-muted text-blue-600"
                          )}
                          onClick={item.onClick}
                        >
                          <Icon className="h-4 w-4" />
                          <motion.li variants={variants}>
                            {!isCollapsed && (
                              <div className="ml-2 flex items-center gap-2">
                                <p className="text-sm font-medium">{item.label}</p>
                                {item.badge && (
                                  <span className="ml-auto flex h-5 items-center justify-center rounded-full bg-green-500 px-2 text-xs font-medium text-white">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.li>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <Separator className="mt-auto" />
                <div className="flex flex-col gap-2 p-2">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex h-8 w-full flex-row items-center justify-start rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                    )}
                    onClick={() => {
                      // Handle logout
                      window.location.href = "/logout";
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <motion.li variants={variants}>
                      {!isCollapsed && (
                        <p className="ml-2 text-sm font-medium">Logout</p>
                      )}
                    </motion.li>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile section at the bottom */}
          <div className="p-3 border-t">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <motion.li variants={variants}>
                {!isCollapsed && (
                  <div className="ml-2">
                    <p className="text-xs font-semibold text-gray-900">Publisher</p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                )}
              </motion.li>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}