"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, Users } from "lucide-react";

const AppSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/Dashboard", label: "Dashboard", icon: Home },
    { href: "/Tickets", label: "Tickets", icon: Ticket },
    { href: "/Customer", label: "Customer", icon: Users },
  ];

  return (
    <aside
      className={cn(
        "h-screen w-64 bg-white border-r border-gray-200",
        "flex flex-col items-start py-4"
      )}
    >
      {/* Navigation Links */}
      <nav className="flex-1 w-full px-4 bg-white">
        <ul className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-gray-700 rounded-md",
                  "hover:bg-gray-100 hover:text-gray-900",
                  pathname === href ? "bg-gray-100 text-gray-900" : ""
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
