"use client"


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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartConfigInterface, ChartDataInterface, RechartDataConversionInterface, SingleCategoryInterface } from "@/controllers/interfaces"
import { useEffect, useState } from "react"
import { convertToRechartStructure } from "@/controllers/rechart.controllers"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"



interface ReviewOutcomeArgument {
    casesPerReviewOutcome: SingleCategoryInterface | null
}

export function ROBarChart({ casesPerReviewOutcome }: ReviewOutcomeArgument) {
    const [rechartData, setRechartData] = useState<RechartDataConversionInterface>()
    useEffect(() => {
        if (casesPerReviewOutcome) {
            const convertedRechartData: RechartDataConversionInterface = convertToRechartStructure(casesPerReviewOutcome)
            const dataWithoutNullValues = convertedRechartData.chartData
                .filter(item => item.nameKey !== "null")
                .sort((a, b) => b.dataKey - a.dataKey)
            convertedRechartData.chartData = dataWithoutNullValues
            setRechartData(convertedRechartData)
        }
    }, [casesPerReviewOutcome])
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Cases Per Review Outcome</CardTitle>
                <CardDescription>Top: {rechartData?.topFac} ({rechartData?.topFacCount})</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
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
                                tickFormatter={(value) => value.slice(0, 8)}
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
        </Card>
    )
}
