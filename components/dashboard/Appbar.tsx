"use client"

import type * as React from "react"
import {
  BarChart3,
  Home,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  ChevronDown,
  User,
  UserPlus
} from "lucide-react"

import { useSession } from "next-auth/react"

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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

// Navigation data for the order taking app
const navData = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Menu",
      url: "/dashboard/menu",
      icon: Menu,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: UserPlus,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const {data} = useSession();

  function handleLogout(){
    console.log("clicked logout.")
    signOut({
      callbackUrl:"/",
      redirect:true
    })
  }

  return (
    <Sidebar {...props} className="border-r border-orange-100">
      <SidebarHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">OrderEase</span>
            <span className="text-xs text-gray-600">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="mx-2 rounded-lg hover:bg-orange-50 hover:text-orange-700 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-800 data-[active=true]:font-medium transition-colors"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="mx-2 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={data?.user.image || ""} alt="User" />
                      <AvatarFallback className="bg-orange-500 text-white text-sm">U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate">{data?.user.name || "user"}</span>
                      <span className="text-xs pb-2 text-gray-600 truncate">{data?.user.email|| "random@gmail.com"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] mb-2 border-orange-200">
                <DropdownMenuItem className="hover:bg-orange-50 focus:bg-orange-50">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-orange-50 focus:bg-orange-50">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-orange-200" />
                <DropdownMenuItem onClick={handleLogout}  className="hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-700">
                  <LogOut className="w-full h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
