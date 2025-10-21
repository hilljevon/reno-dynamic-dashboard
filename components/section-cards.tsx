"use client"
import { IconTrendingDown, IconTrendingDown2, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CasesInterface, CategoryArgumentInterface, FullCategorizedInterface } from "@/controllers/interfaces"
import { caseBreakdown } from "@/controllers/excel.controllers"
import { calculateNewSectionCardScores } from "@/controllers/rechart.controllers"
const septemberNumbers = {
  avgCasePerDay: 435,
  avgStablePerOursMd: 60,
  avgLos: 7.7,
  topFacility: "Centinela Hospital Medical Center",
  topFacilityAverageCount: 9
}
interface ComparisonScoreInterface {
  caseDifference: number,
  stableDifference: number,
  losDifference: number,
  topFac: string,
  topFacCount: number,
  caseCountPercent: number,
  stablePercentDifference: number,
  losPercentDifference: number
}
export function SectionCards({ categorizedCases }: CategoryArgumentInterface) {
  // This will contain our relevant scores 
  const [comparisonScores, setComparisonScores] = useState<ComparisonScoreInterface>({
    caseDifference: 0,
    stableDifference: 0,
    losDifference: 0,
    topFac: "",
    topFacCount: 0,
    caseCountPercent: 0,
    stablePercentDifference: 0,
    losPercentDifference: 0
  })
  // Each time file uploaded, calculate new scores
  useEffect(() => {
    if (categorizedCases) {
      const newScores = calculateNewSectionCardScores(categorizedCases)
      setComparisonScores(newScores)
    }
  }, [categorizedCases])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* CASE COUNT CARD */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Cases</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {categorizedCases?.totalCaseCount}
          </CardTitle>
          {/* PERCENTAGE DIFFERENCE */}
          <CardAction>
            {comparisonScores.caseCountPercent >= 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                +{comparisonScores.caseCountPercent}%
              </Badge>
            ) : (
              <Badge variant="outline">
                <IconTrendingDown2 />
                {comparisonScores.caseCountPercent}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        {/* TOTAL COUNT DIFFERENCE */}
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {comparisonScores.caseDifference >= 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                {comparisonScores.caseDifference} more cases today <IconTrendingUp className="size-4" />
              </div>
            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                {comparisonScores.caseDifference} less cases today <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
          <div className="text-muted-foreground">Compared to September Average: {septemberNumbers.avgCasePerDay} </div>
        </CardFooter>
      </Card>
      {/* STABLE PER OURS MD CARD */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stable for Transfer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {categorizedCases?.stableCases.length}
          </CardTitle>
          <CardAction>
            {comparisonScores.stablePercentDifference >= 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                +{comparisonScores.stablePercentDifference}%
              </Badge>
            ) : (
              <Badge variant="outline">
                <IconTrendingDown2 />
                {comparisonScores.stablePercentDifference}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {comparisonScores.stableDifference >= 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                {comparisonScores.stableDifference} more stable cases today (per OURS MD) <IconTrendingUp className="size-4" />
              </div>

            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                {comparisonScores.stableDifference} less cases today <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
          <div className="text-muted-foreground">Compared to September Average: {septemberNumbers.avgStablePerOursMd} </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average LOS</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {categorizedCases?.losAverage}
          </CardTitle>
          <CardAction>
            {comparisonScores.losPercentDifference >= 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                +{comparisonScores.losPercentDifference}%
              </Badge>
            ) : (
              <Badge variant="outline">
                <IconTrendingDown2 />
                {comparisonScores.losPercentDifference}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {comparisonScores.losDifference} Day Difference
          </div>
          <div className="text-muted-foreground">Compared to September Average: {septemberNumbers.avgLos} </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top facility</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums">
            {comparisonScores.topFac}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            # of patients today: {comparisonScores.topFacCount} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Top Facility Last Month: {septemberNumbers.topFacility} </div>
        </CardFooter>
      </Card>

    </div>
  )
}
