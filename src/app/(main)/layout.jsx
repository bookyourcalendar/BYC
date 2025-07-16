"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Home, Ticket, Users, Settings, User, LogOutIcon } from 'lucide-react'
import { SignOutButton, useUser } from "@clerk/nextjs"
import { useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/layout/NotificationBell"
import { UserMenu } from "@/components/layout/UserMenu"
import { SidebarTrigger } from "@/components/layout/SidebarTrigger"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  { href: "/Dashboard", label: "Dashboard", icon: Home },
  { href: "/Tickets", label: "Support Tickets", icon: Ticket },
  { href: "/Customer", label: "Customer List", icon: Users },
]

function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { openUserProfile } = useClerk()
    
  return (
    <Sidebar className="fixed left-0 top-0 z-30 h-screen w-[250px] bg-white border-r border-gray-200">
      <SidebarHeader className="py-2 px-2">
        <Link href="/" className="block">
          <Image
            src="/images/Group-3.png"
            width={250}
            height={40}
            alt="Book Your Calendar"
            priority
            className="group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/images/Group-3.png"
            width={40}
            height={40}
            alt="Logo"
            priority
            className="hidden group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="pt-5 px-2">
        <SidebarMenu>
          {links.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900 data-[active=true]:font-medium rounded-md px-4 py-3 h-auto"
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || 'user@example.com'}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem onClick={() => openUserProfile()} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Manage Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className="text-red-500 cursor-pointer px-4 py-2">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}

// Header component that responds to sidebar state
function AppHeader() {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  
  return (
    <header 
      className={`fixed top-0 right-0 left-0 bg-white flex justify-between items-center p-4 border-b z-20 transition-all duration-300 ease-in-out
        ${state === "expanded" && !isMobile ? "md:left-[250px]" : "md:left-[48px]"}`}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-10 w-10" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 ml-2 truncate">
          {links.find((item) => item.href === pathname)?.label || "Dashboard"}
        </h2>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false)
  
  // Ensure client-side rendering is used
  useEffect(() => {
    setMounted(true)
  }, [])
    
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden w-full">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 w-full">
          <AppHeader />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
}

function MainContent({ children }) {
  const { state, isMobile } = useSidebar()
  
  return (
    <main 
      className={"flex-1 pt-16 px-4 py-4 w-full transition-all duration-300 ease-in-out"}
    >
      <div className="w-full h-full">
        {children}
      </div>
    </main>
  )
}
