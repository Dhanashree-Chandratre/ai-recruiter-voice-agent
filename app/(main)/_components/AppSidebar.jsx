"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button.jsx";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../../components/ui/sidebar.jsx";
import { SideBarOptions } from "../../../services/Constants.jsx";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();

  const handleCreateNewInterview = () => {
    console.log("Create New Interview button clicked");
    router.push("/dashboard/create-interview");
  };

  return (
    <Sidebar className="bg-white">
      <SidebarHeader className="flex flex-col items-center mt-5 gap-6">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[200px]"
        />
        <Button className="w-full" onClick={handleCreateNewInterview}>
          <Plus /> Create New Interview
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-5 ${path == option.path && "bg-violet-100"}`}
                  >
                    <Link href={option.path}>
                      <option.icon
                        className={`text-[16px] ${
                          path == option.path && "text-primary"
                        }`}
                      />
                      <span
                        className={`text-[16px] font-medium ${
                          path == option.path && "text-primary"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
