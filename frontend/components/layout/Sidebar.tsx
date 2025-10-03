"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  MessageSquare,
  Network,
  Box,
  Settings,
  Upload,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: "Upload",
    href: "/upload",
    icon: Upload,
    description: "Upload and parse documents",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    description: "View processed documents",
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
    description: "AI chatbot with citations",
  },
  {
    name: "Knowledge Graph",
    href: "/graph",
    icon: Network,
    description: "Explore entity relationships",
  },
  {
    name: "Vector Space",
    href: "/vectors",
    icon: Box,
    description: "Vector embeddings explorer",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Usage and performance metrics",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure RAG-Anything",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-muted/40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Network className="h-6 w-6 text-primary" />
            <span className="text-lg">RAG Studio</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <Network className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8", collapsed && "absolute right-2")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-2">
        <TooltipProvider>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground font-medium",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return <li key={item.href}>{linkContent}</li>;
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">RAG-Anything Studio</p>
            <p>v1.0.0 Beta</p>
          </div>
        </div>
      )}
    </aside>
  );
};
