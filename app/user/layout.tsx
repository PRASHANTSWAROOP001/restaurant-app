"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/user/UserAppbar"

export default function Layout({children}:{children:React.ReactNode}){
    return (
       <SidebarProvider>
        <AppSidebar> </AppSidebar>
            <main className="w-full h-screen">
                <SidebarTrigger/>
                {children}
            </main>
        
       </SidebarProvider>
    )
}