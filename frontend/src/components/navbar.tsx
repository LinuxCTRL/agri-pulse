"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Sprout, Leaf, Flower2 } from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/garden", label: "My Garden", icon: Flower2 },
  { href: "/crops", label: "Crops", icon: Sprout },
  { href: "/varieties", label: "Varieties", icon: Leaf },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto flex h-16 items-center px-6">
        <Link href="/" className="mr-8 flex items-center space-x-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Agri<span className="text-primary">Pulse</span>
          </span>
        </Link>
        <nav className="flex items-center space-x-1 ml-auto md:ml-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-full transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "")} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:flex items-center ml-auto gap-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-emerald-400 border-2 border-white shadow-sm" />
        </div>
      </div>
    </header>
  );
}
