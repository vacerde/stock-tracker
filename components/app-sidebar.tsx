"use client"

import {
  BarChart3,
  Bell,
  BookOpen,
  DollarSign,
  Home,
  Search,
  Settings,
  Star,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Portfolio", url: "/portfolio", icon: Wallet },
      { title: "Watchlist", url: "/watchlist", icon: Star },
    ],
  },
  {
    title: "Markets",
    items: [
      { title: "Stocks", url: "/stocks", icon: TrendingUp },
      { title: "Crypto", url: "/crypto", icon: DollarSign },
      { title: "Screeners", url: "/screeners", icon: Search },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "News", url: "/news", icon: BookOpen },
      { title: "Alerts", url: "/alerts", icon: Bell },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TradeTracker</span>
            <span className="text-xs text-muted-foreground">Pro</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
