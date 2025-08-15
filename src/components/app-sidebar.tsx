"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
// import { logout } from "@/lib/server/auth";
import { toast } from "sonner";
import { logoutAction } from "@/lib/actions/auth";
import { useTransition } from "react";

const data = {
  navMain: [
    {
      title: "My Space",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Todos",
          url: "/todos",
        },
        {
          title: "Sticky Notes",
          url: "/sticky-notes",
        },
      ],
    },
    {
      title: "Teams",
      url: "#",
      items: [
        {
          title: "Team A",
          url: "/team-a",
        },
        {
          title: "Team B",
          url: "/team-b",
        },
      ],
    },
  ],
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="text-primary font-bold">Simply Task</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url === pathname}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="border-t-[1px]">
        <Button
          className="text-white"
          onClick={handleLogout}
          disabled={isPending}
        >Logout</Button>
      </SidebarFooter >
    </Sidebar>
  );
}
