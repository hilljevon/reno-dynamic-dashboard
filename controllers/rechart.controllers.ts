import { ChartConfig } from "@/components/ui/chart";
import { ChartConfigInterface, ChartDataInterface, FullCategorizedInterface, SingleCategoryInterface } from "./interfaces"

const septemberNumbers = {
    avgCasePerDay: 435,
    avgStablePerOursMd: 60,
    avgLos: 7.7,
    topFacility: "Centinela Hospital Medical Center",
    topFacilityAverageCount: 9
}
const calculatePercentDifference = (a: number, b: number) => {
    return Math.round((Math.abs(a - b) / ((a + b) / 2) * 100) * 10) / 10;
}
export function calculateNewSectionCardScores(categorizedCases: FullCategorizedInterface) {
    const caseDifference = categorizedCases.totalCaseCount - septemberNumbers.avgCasePerDay;
    const caseCountPercent = calculatePercentDifference(categorizedCases.totalCaseCount, septemberNumbers.avgCasePerDay)
    const stableDifference = categorizedCases.stableCases.length - septemberNumbers.avgStablePerOursMd;
    const stablePercentDifference = calculatePercentDifference(categorizedCases.stableCases.length, septemberNumbers.avgStablePerOursMd)
    const losDifference = Math.round((categorizedCases.losAverage - septemberNumbers.avgLos) * 10) / 10;
    const losPercentDifference = calculatePercentDifference(categorizedCases.losAverage, septemberNumbers.avgLos)
    // this goes through all facility keys and returns the array that has the greatest length. that will be associated with the most frequent facility count
    const topFac = Object.keys(categorizedCases.casesPerFacility).reduce((a, b) => {
        return categorizedCases.casesPerFacility[a].length > categorizedCases.casesPerFacility[b].length ? a : b
    })
    const topFacCount = categorizedCases.casesPerFacility[topFac].length;
    const newScores = {
        caseDifference,
        caseCountPercent,
        stableDifference,
        stablePercentDifference,
        losDifference,
        losPercentDifference,
        topFac,
        topFacCount
    }
    return newScores
}
// blue and purple color palette (Sisu (Personnage Disney) + The Usual Suspects + Purple and Blues)
const colorHexCodes = [
    "#ace8f2",
    "#1c5d89",
    "#4ebcff",
    "#a9edf1",
    "#216778",
    "#7347a9",
    "#71a2c4",
    "#004078",
    "#076776",
    // Purple and Blues
    "#b76bff",
    "#177ecb",
    "#885bfe",
    "#1c46ac",
    "#7044e1"
]
export function convertToRechartStructure(caseCategoryObject: SingleCategoryInterface) {
    const topFac = Object.keys(caseCategoryObject).reduce((a, b) => {
        return caseCategoryObject[a].length > caseCategoryObject[b].length ? a : b
    })
    const chartConfig: ChartConfigInterface = {
        dataKey: {
            label: "Qty",
            color: "#1c5d89"
        }
    } satisfies ChartConfig
    const chartData: ChartDataInterface[] = []
    const topFacCount = caseCategoryObject[topFac].length;
    // Here I am looping through all review outcome strings to create a chart config + data conversion that matches our rechart schema
    Object.keys(caseCategoryObject).forEach((key, idx) => {
        const fill = key.replace(/\s+/g, "")
        chartConfig[fill] = { label: key, color: colorHexCodes[idx] }
        chartData.push(
            { nameKey: key, dataKey: caseCategoryObject[key].length, fill: colorHexCodes[idx] }
        )
    })
    const fullRechartData = { topFac, topFacCount, chartData, chartConfig }
    return fullRechartData
}