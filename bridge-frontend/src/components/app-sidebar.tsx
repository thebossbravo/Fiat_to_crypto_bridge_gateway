import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerTerminalIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, ChartRingIcon, SentIcon, Calculator01Icon, AnalyticsIcon } from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "Bridge User",
    email: "user@bridge.com",
    avatar: "/avatars/bridge.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />
      ),
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: (
        <HugeiconsIcon icon={AnalyticsIcon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Analytics Dashboard",
          url: "/dashboard/analytics",
        },
        {
          title: "Volume Analysis",
          url: "/dashboard/analytics/volume",
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/analytics/performance",
        },
      ],
    },
    {
      title: "Tools",
      url: "/dashboard/tools",
      icon: (
        <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Currency Converter",
          url: "/dashboard/converter",
        },
        {
          title: "Reconciliation",
          url: "/dashboard/reconciliation",
        },
      ],
    },
    {
      title: "Bridge Operations",
      url: "/bridge",
      icon: (
        <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />
      ),
      items: [
        {
          title: "New Transaction",
          url: "/dashboard",
        },
        {
          title: "Transaction History",
          url: "/dashboard/history",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
        {
          title: "Preferences",
          url: "/settings/preferences",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#FF4500] text-white">
                  <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">Bridge</span>
                  <span className="truncate text-xs text-zinc-400">Protocol</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
