"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { caseBreakdown, parseExcel } from "@/controllers/excel.controllers";
import * as XLSX from "xlsx";
import { toast } from 'sonner';
import { useState } from "react";
import { Input } from "./ui/input";
import { CasesInterface } from "@/controllers/interfaces";
interface SiteHeaderArguments {
  setCasesToday?: React.Dispatch<React.SetStateAction<CasesInterface[] | null>> | null
}

export function SiteHeader({ setCasesToday }: SiteHeaderArguments) {
  async function handleExcelFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = e.target?.result;
      if (binaryData) {
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const ccrCaseWorksheet = workbook["Sheets"]["Details"]
        const { caseCensus, allColumnNames } = parseExcel(ccrCaseWorksheet)
        if (caseCensus && setCasesToday) {
          setCasesToday(caseCensus)
          toast.success("Excel sheet read correctly. Cases parsed.")
        }
      }
    };
    reader.readAsBinaryString(file);
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-row p-4 border-0">
          {/* <h1 className="text-base font-medium mx-4">Insert file</h1> */}
          <Input
            name='fileUpload'
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelFile}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="/"
              // rel="noopener noreferrer"
              // target="_blank"
              className="dark:text-foreground"
            >
              Reset
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
