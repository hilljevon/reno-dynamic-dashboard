"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartConfigInterface, ChartDataInterface, RechartDataConversionInterface, SingleCategoryInterface } from "@/controllers/interfaces"
import { useEffect, useState } from "react"
import { convertToRechartStructure } from "@/controllers/rechart.controllers"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"



interface ReviewOutcomeArgument {
    casesPerReviewOutcome: SingleCategoryInterface | null
}

interface AnticipatedDispoArguments {
    casesPerFacility: SingleCategoryInterface | null
}
export function MedicalHomeBarChart({ casesPerFacility }: AnticipatedDispoArguments) {
    const [rechartData, setRechartData] = useState<RechartDataConversionInterface>()
    useEffect(() => {
        if (casesPerFacility) {
            const convertedRechartData: RechartDataConversionInterface = convertToRechartStructure(casesPerFacility)
            const medicalHomeDataSlice = convertedRechartData.chartData
                .filter(item => item.nameKey !== "null") // exclude invalid entries
                .sort((a, b) => b.dataKey - a.dataKey)   // sort descending 
                .slice(0, 7);
            convertedRechartData.chartData = medicalHomeDataSlice
            setRechartData(convertedRechartData)
        }
    }, [casesPerFacility])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cases Per Medical Home</CardTitle>
                <CardDescription>Top: {rechartData?.topFac} ({rechartData?.topFacCount})</CardDescription>
            </CardHeader>
            <CardContent>
                {rechartData && (
                    <ChartContainer config={rechartData.chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={rechartData.chartData}
                            margin={{
                                top: 30,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                className="text-xs"
                                dataKey="nameKey"
                                tickLine={false}
                                tickMargin={14}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 6)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="dataKey" fill="var(--color-dataKey)" radius={4}>
                                <LabelList
                                    position="top"
                                    offset={6}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
