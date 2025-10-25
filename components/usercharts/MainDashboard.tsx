"use client"
import React, { useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { CMBarChart } from "@/components/usercharts/CMBarChart"
import { AnticipatedDispoBarChart } from "@/components/usercharts/AnticipatedDispoBarChart"
import { MedicalHomeBarChart } from "@/components/usercharts/MedicalHomeBarChart"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import data from "@/lib/data.json"
import { UserFiltersField } from "@/components/usercharts/UserFiltersField"
import { CasesInterface, FullCategorizedInterface } from '@/controllers/interfaces'
import { caseBreakdown } from '@/controllers/excel.controllers'
import { SectionCards } from '../section-cards'
import { SiteHeader } from '../site-header'
import { ROBarChart } from './ROBarChart'
import { CasesTable } from '../datatable/CasesTable'


const MainDashboard = () => {
    const [casesToday, setCasesToday] = useState<CasesInterface[] | null>(null)
    const [categorizedCases, setCategorizedCases] = useState<FullCategorizedInterface | null>(null)
    // each time the file is updated with a new case assignment, this use effect runs and new categorized cases are generated.
    useEffect(() => {
        if (casesToday) {
            const categorized = caseBreakdown(casesToday)
            setCategorizedCases(categorized)
        }
    }, [casesToday])
    console.log("Cases per RN", categorizedCases?.casesPerRN)
    return (
        <>
            <SiteHeader setCasesToday={setCasesToday} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    {categorizedCases && (
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards categorizedCases={categorizedCases} />
                            {/* Mid section charts */}
                            <div className="px-4 lg:px-6 grid grid-cols-3 gap-4">
                                <ROBarChart casesPerReviewOutcome={categorizedCases.casesPerReviewOutcome} />
                                <AnticipatedDispoBarChart casesPerAnticipatedDispo={categorizedCases.casesPerAnticipatedDispo} />
                                <MedicalHomeBarChart casesPerFacility={categorizedCases.casesPerMedicalHome} />
                            </div>
                            {/* CM Bar Chart */}
                            <div className="px-4 lg:px-6 grid grid-cols-1 gap-4">
                                {categorizedCases.casesPerRN && (
                                    <CMBarChart casesPerRN={categorizedCases.casesPerRN} casesPerCma={categorizedCases.casesPerCma} />
                                )}
                            </div>
                            {/* Accordion Filters */}
                            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
                                <Accordion className="border rounded-lg py-2.5 shadow-sm px-6" type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-center items-center">Filters</AccordionTrigger>
                                        <AccordionContent className="w-full">
                                            <UserFiltersField />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            {casesToday && (
                                <div className='flex w-full mx-auto px-8'>
                                    <CasesTable data={casesToday} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MainDashboard