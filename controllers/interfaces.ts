export interface CasesInterface {
    caseId: string;
    censusDate: Date | null;
    primaryMedicalHome: string;
    mtt: string;
    rn: string;
    serviceCode: string;
    coverageType: string | null;
    dob: string | null;
    los: string;
    dx: string | null;
    vendorName: string;
    admitDate: string | null;
    lastReviewDate: string | null;
    lastCmDate: string | null;
    notAuthorized: string | null;
    lastPadReason: string | null;
    padReasonEnteredDate: string | null;
    levelOfCare: string | null;
    priorityLevel: string | null;
    reviewOutcome: string;
    reviewOutcomeReason: string | null;
    enteredDate: string | null;
    anticipatedDisposition: string | null;
    barriersToDisposition: string | null;
    stabilityOrderReceived: string | null;
    stabilityNkfCmVerbal: string | null;
    sftEvent: string | null;
    sftDateTime: string | null;
    lastPertinentEventDate: string | null;
    stablePerOursMd: string | null;
    reason: string | null;
    authStartDate: string | null;
    authEndDate: string | null;
    lastReviewRequired: string | null;
}

export interface SingleCategoryInterface {
    [key: string]: CasesInterface[]
}

// categorized cases interface contains all of our cases in each category. OrganizedCaseInterface is the interface for each object. 
export interface FullCategorizedInterface {
    casesPerCma: SingleCategoryInterface,
    casesPerFacility: SingleCategoryInterface,
    casesPerMedicalHome: SingleCategoryInterface,
    casesPerAnticipatedDispo: SingleCategoryInterface,
    casesPerMtt: SingleCategoryInterface,
    casesPerRN: SingleCategoryInterface,
    casesPerReviewOutcome: SingleCategoryInterface,
    casesPerServiceCode: SingleCategoryInterface,
    losAverage: number,
    stableCases: CasesInterface[],
    totalCaseCount: number
}
export interface CategoryArgumentInterface {
    categorizedCases: FullCategorizedInterface | null
}

export interface ChartConfigInterface {
    [key: string]: { label?: string, color?: string }
}
export interface ChartDataInterface {
    nameKey: string,
    dataKey: number,
    fill: string,
    fullData: CasesInterface[],
    key: string
}

export interface RechartDataConversionInterface {
    chartConfig: ChartConfigInterface,
    chartData: ChartDataInterface[],
    topFac: string,
    topFacCount: number
}