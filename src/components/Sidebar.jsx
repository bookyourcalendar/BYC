import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Ticket, Users } from "lucide-react";

const AppSidebar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const links = [
    { href: "/Dashboard", label: "Dashboard", icon: Home },
    { href: "/Tickets", label: "Support Tickets", icon: Ticket },
    { href: "/Customer", label: "Customer List", icon: Users },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden p-2 text-gray-800 focus:outline-none absolute top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-[250px] bg-white border-r border-gray-200
        flex flex-col py-2 px-2 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:w-[250px]`}
      >
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image
            src="/navlogo.png"
            width={250}
            height={40}
            alt="Book Your Calendar"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 pt-5">
          <ul className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-md
                  hover:bg-gray-100 hover:text-gray-900 transition
                  ${
                    pathname === href
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AppSidebar;
