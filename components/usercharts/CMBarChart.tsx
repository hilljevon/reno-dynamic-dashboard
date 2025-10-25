"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { CasesInterface, ChartConfigInterface, ChartDataInterface, RechartDataConversionInterface, SingleCategoryInterface } from "@/controllers/interfaces"
import { convertToRechartStructure } from "@/controllers/rechart.controllers"




interface CMArgumentInterface {
    casesPerRN: SingleCategoryInterface | null,
    casesPerCma: SingleCategoryInterface | null
}

interface UnfilteredRnCMADataInterface {
    RN: RechartDataConversionInterface | null,
    CMA: RechartDataConversionInterface | null
}
interface TotalCountInterface {
    RN: number,
    CMA: number
}
interface ServiceCodeInterface {
    [key: string]: number
}
export function CMBarChart({ casesPerRN, casesPerCma }: CMArgumentInterface) {
    if (!casesPerRN || !casesPerCma) return null
    const [currentData, setCurrentData] = React.useState<ChartDataInterface[]>()
    const [currentChartConfig, setCurrentChartConfig] = React.useState<any>()
    const [rechartRnData, setRechartRnData] = React.useState<RechartDataConversionInterface>()
    const [rechartCmaData, setRechartCmaData] = React.useState<RechartDataConversionInterface>()
    const [totals, setTotals] = React.useState<TotalCountInterface>({ RN: 0, CMA: 0 })
    // determines which bar chart is active
    const [activeChart, setActiveChart] = React.useState<string>("RN")
    const [unfilteredRnCMAData, setUnfilteredRnCMAData] = React.useState<UnfilteredRnCMADataInterface>({ RN: null, CMA: null })
    // here we need to generate all relevant RN analytics from the cases
    const getRnAnalytics = (cases: CasesInterface[]) => {
        const serviceCodes: ServiceCodeInterface = {}
        for (let cs of cases) {
            if (serviceCodes[cs.serviceCode]) {
                serviceCodes[cs.serviceCode] = serviceCodes[cs.serviceCode] + 1
            } else {
                serviceCodes[cs.serviceCode] = 1;
            }
        }
        const sortedServiceCodes = Object.fromEntries(
            Object.entries(serviceCodes).sort(([a], [b]) => a.localeCompare(b))
        );
        return sortedServiceCodes
    }
    const getCMAAnalytics = (cases: CasesInterface[]) => {
        const serviceCodes: ServiceCodeInterface = {}
        for (let cs of cases) {
            if (serviceCodes[cs.serviceCode]) {
                serviceCodes[cs.serviceCode] = serviceCodes[cs.serviceCode] + 1
            } else {
                serviceCodes[cs.serviceCode] = 1;
            }
        }
        return serviceCodes
    }
    const filterData = (rechartRnData: ChartDataInterface[], rechartCMAData: ChartDataInterface[]) => {
        const newRnData = rechartRnData
            .filter(item => item.nameKey !== 'OTHER' && item.dataKey < 30)
            .map(item => ({
                ...item,
                nameKey: item.nameKey.includes('-')
                    ? item.nameKey.split('-')[1]
                    : item.nameKey
            }))
            .sort((a, b) => b.dataKey - a.dataKey);

        const newCmaData = rechartCMAData
            .filter(item => item.nameKey !== 'OTHER')
            .map(item => ({
                ...item,
                nameKey: item.nameKey.includes('-')
                    ? item.nameKey.split('-')[1]
                    : item.nameKey
            }))
            .sort((a, b) => b.dataKey - a.dataKey);
        const RNTotal = newRnData.reduce((sum, item) => sum + item.dataKey, 0);
        const CMATotal = newCmaData.reduce((sum, item) => sum + item.dataKey, 0);
        setTotals({ RN: RNTotal, CMA: CMATotal })
        return { newRnData, newCmaData }
    }
    // calculates totals for each chart button
    React.useEffect(() => {
        if (casesPerRN && casesPerCma) {
            const unfilteredRnRechartData: RechartDataConversionInterface = convertToRechartStructure(casesPerRN)
            const unfilteredCMARechartData: RechartDataConversionInterface = convertToRechartStructure(casesPerCma)
            // this stores our original data
            setUnfilteredRnCMAData({ RN: unfilteredRnRechartData, CMA: unfilteredCMARechartData })
            const { newRnData, newCmaData } = filterData(unfilteredRnRechartData.chartData, unfilteredCMARechartData.chartData)
            unfilteredRnRechartData.chartData = newRnData;
            unfilteredCMARechartData.chartData = newCmaData
            setCurrentData(unfilteredRnRechartData.chartData)
            setCurrentChartConfig(unfilteredRnRechartData.chartConfig)
            setRechartRnData(unfilteredRnRechartData)
            setRechartCmaData(unfilteredCMARechartData)
        }
    }, [casesPerRN, casesPerCma])
    React.useEffect(() => {
        if (activeChart == "RN") {
            setCurrentData(rechartRnData?.chartData)
            setCurrentChartConfig(rechartRnData?.chartConfig)
        } else {
            setCurrentData(rechartCmaData?.chartData)
            setCurrentChartConfig(rechartCmaData?.chartConfig)
        }
    }, [activeChart, casesPerRN, rechartCmaData, rechartRnData])
    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Case Count Per Case Manager</CardTitle>
                    <CardDescription>
                        Showing total case count for each case manager
                    </CardDescription>
                </div>
                <div className="flex">

                    {/* button for each different section. here would be CM and CMA */}
                    {["RN", "CMA"].map((key, idx) => {
                        const chart = key
                        return (
                            <button
                                key={idx}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {key}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {key == "RN" ? totals.RN : totals.CMA}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {currentChartConfig && (
                    <ChartContainer
                        config={currentChartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={currentData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="nameKey"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                interval={0} // show every label
                                height={60} // give labels extra space
                                tick={({ x, y, payload }) => (
                                    <text
                                        x={x}
                                        y={y + 20}
                                        textAnchor="middle"
                                        fontSize={9}
                                        style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {payload.value.length > 12
                                            ? payload.value.slice(0, 10) + "…" // truncate long names
                                            : payload.value}
                                    </text>
                                )}
                            />
                            <ChartTooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload || !payload.length) return null;
                                    const data: ChartDataInterface = payload[0].payload; // this is your full data object!
                                    // depending on the chart type, a different set of analytics is produced
                                    let serviceCodeObject: Record<string, number> = {};
                                    if (activeChart == "RN") {
                                        serviceCodeObject = getRnAnalytics(data.fullData)
                                        console.log("Service code object here", serviceCodeObject)
                                    } else {
                                        serviceCodeObject = getCMAAnalytics(data.fullData)
                                    }
                                    console.log("My data here", data)
                                    return (
                                        <div className="rounded-md bg-white p-3 shadow-md border border-gray-200 text-sm">
                                            <p className="font-bold text-gray-900 py-1 underline">{data.nameKey}</p>
                                            <p className="text-gray-600">Cases: {data.dataKey}</p>
                                            {serviceCodeObject &&
                                                Object.entries(serviceCodeObject).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between text-sm text-gray-700"
                                                    >
                                                        <span className="font-medium text-blue-700">{key}</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="dataKey" />
                        </BarChart>
                    </ChartContainer>
                )}

            </CardContent>
        </Card>
    )
}
