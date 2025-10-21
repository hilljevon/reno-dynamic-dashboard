"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CMBarChart } from "@/components/usercharts/CMBarChart"
import { AnticipatedDispoBarChart } from "@/components/usercharts/AnticipatedDispoBarChart"
import { ROPieChart } from "@/components/usercharts/ROPieChart"
import { TopFacilitiesBarChart } from "@/components/usercharts/TopFacilitiesBarChart"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import data from "@/lib/data.json"
import { UserFiltersField } from "@/components/usercharts/UserFiltersField"
import MainDashboard from "@/components/usercharts/MainDashboard"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <MainDashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
