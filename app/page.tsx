
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import MainDashboard from "@/components/usercharts/MainDashboard"

export default function Page() {
  console.log("Rendering page.tsx")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <MainDashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
