"use client"

import * as React from "react"
import {
  Stamp,
  Target,
  TrendingUp,
  Settings,
  User,
  Grid3X3,
  PlusCircle,
  Search,
  BarChart3,
  DollarSign,
  Crown,
  BookOpen,
  Shield
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Stamp Collector",
    email: "collector@example.com",
    avatar: "/avatars/collector.jpg",
  },
  navMain: [
    {
      title: "Collections",
      url: "/collections",
      icon: Grid3X3,
      isActive: true,
      items: [
        {
          title: "All Collections",
          url: "/collections",
        },
        {
          title: "Add New Collection",
          url: "/collections/new",
        },
        {
          title: "Browse Stamps",
          url: "/stamps",
        },
        {
          title: "Add New Stamp",
          url: "/stamps/new",
        },
      ],
    },
    {
      title: "Budget & Spending",
      url: "/budget",
      icon: Target,
      items: [
        {
          title: "Spend Limits",
          url: "/budget/limits",
        },
        {
          title: "Budget Reports",
          url: "/budget/reports",
        },
        {
          title: "Spending History",
          url: "/budget/history",
        },
      ],
    },
    {
      title: "Sales & Value",
      url: "/sales",
      icon: TrendingUp,
      items: [
        {
          title: "Sales Dashboard",
          url: "/sales",
        },
        {
          title: "Mark as Sold",
          url: "/sales/new",
        },
        {
          title: "Value Tracking",
          url: "/sales/values",
        },
        {
          title: "Profit Analysis",
          url: "/sales/profits",
        },
      ],
    },
    {
      title: "Account & Billing",
      url: "/account",
      icon: User,
      items: [
        {
          title: "Account Overview",
          url: "/account",
        },
        {
          title: "Subscription",
          url: "/account/subscription",
        },
        {
          title: "Usage & Quotas",
          url: "/account/usage",
        },
        {
          title: "Billing History",
          url: "/account/billing",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
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
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Preferences",
          url: "/settings/preferences",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Stamp className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">StampTracker Pro</span>
            <span className="truncate text-xs text-muted-foreground">Professional Edition</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}