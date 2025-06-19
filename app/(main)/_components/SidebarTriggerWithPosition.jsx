import React from "react";
import { SidebarTrigger, useSidebar } from "../../../components/ui/sidebar.jsx";
import { Menu } from "lucide-react";

export function SidebarTriggerWithPosition() {
  const { state, isMobile } = useSidebar();
  const leftClass = isMobile
    ? "left-4"
    : state === "collapsed"
    ? "left-0"
    : "left-[16rem]";
  return (
    <SidebarTrigger
      className={`fixed top-4 ${leftClass} z-50 transition-all duration-200`}
    >
      <Menu className="cursor-pointer" />
    </SidebarTrigger>
  );
}
