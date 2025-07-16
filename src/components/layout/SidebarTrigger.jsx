"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";

export function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className={className}
    >
      <PanelRightOpen className="h-9 w-9" />
    </Button>
  );
} 