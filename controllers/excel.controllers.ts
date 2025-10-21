import { CasesInterface, SingleCategoryInterface } from "./interfaces";
const cmaCodes = [
    "K240033-Loren.Magante",
    "C270827-Adriana.Beltran",
    "Y430144-Apple.Camerino",
    "B556812-Decereeh.Ordonez",
    "E779662-Amy.Thach",
    "M683463-Jacqueline.Apelo",
    "Y703743-Julian.Ames",
    "M520802-Desiree.Pene",
    "D447227-Cristina.Limchico",
]

function extractRowCount(range: string): number {
    const match = range.match(/\d+$/); // Match the last sequence of digits in the string
    return match ? parseInt(match[0], 10) : 4;
}
function convertToDateType(s: string): Date | null {
    if (!s) return null
    if (s.length < 2) {
        return null
    }
    const dateObj = new Date(s);

    return isNaN(dateObj.getTime()) ? null : dateObj;
}

function getCurrentDate(cell: any) {
    const dateString = cell.split("-")[0];
    const convertedDate = convertToDateType(dateString)
    return convertedDate
}

export function parseExcel(cases: any) {
    const columnHeaderIndexes: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK"];
    const caseCensus = []
    const lastCell = cases["!ref"]
    const rowCount = extractRowCount(lastCell)
    const currentDate = getCurrentDate(cases["A1"]["v"])
    const allColumnNames: any = {
        "Case\nId": "",
        "Case Assignment Category": "",
        "Last Assigned RN": "",
        "Primary Medical Home": "",
        "MTT/RA": "",
        "RN": "",
        "Service \nCode": "",
        "Coverage\nType": "",
        "DOB": "",
        "MRN": "",
        "LOS": "",
        "DX": "",
        "Vendor Name": "",
        "Admit Date": "",
        "last review date": "",
        "Last Reviewer Name": "",
        "Last CM Decision Creator": "",
        "Last CMDate": "",
        "Not Authorized": "",
        "Last PAD Reason": "",
        "PAD Reason entered date": "",
        "Level of Care": "",
        "Priority Level": "",
        "Imported From EPRP": "",
        "Review Outcome": "",
        "Review Outcome Reason": "",
        " Entered Date": "",
        "Entered By": "",
        "Anticipated Disposition": "",
        "Barriers to Dispo": "",
        "Stability Order Reveived ": "",
        "StabilityOrder-NKF CM Verbal": "",
        "SFT Event": "",
        "SFT Date/Time": "",
        "Last Pertinent Event": "",
        "Last Pertinent Event Date": "",
        "Stable For Transfer Per OURS MD": "",
        "Reason": "",
        "Morning Rounding Report (12PM)": "",
        "Afternoon Rounding Report (4:30PM)": "",
        "Authorization Start Date": "",
        "Authorization End Date": "",
        "Last Review Required By Date": "",
    }
    // Iterates each column to get the respective column index. 
    for (let columnHeader of columnHeaderIndexes) {
        const columnKey = `${columnHeader}2`
        const currentColumnHeaderName = cases[columnKey]["v"] ? cases[columnKey]["v"] : null
        if (currentColumnHeaderName && currentColumnHeaderName in allColumnNames) {
            allColumnNames[currentColumnHeaderName] = columnHeader
        }
    }
    // Iterating each case row
    for (let currentRow = 3; currentRow < rowCount; currentRow++) {
        // Creating a temp object due to automatic hashing in caseHashTable object.
        const tempRowObject: any = {}
        // Once inside a row, iterate through each column and add it to our tempRowObject hash. Example: Key: Column Title (MTT/RA). Value: 
        for (const [key, value] of Object.entries(allColumnNames)) {
            let currentKey = `${value}${currentRow}`
            // Make sure there is a value on the cell
            if (cases[currentKey]) {
                tempRowObject[key] = cases[currentKey]["w"]
            } else {
                tempRowObject[key] = null
            }
        }

        // We need to redefine the object keys to match what our database column names are for smooth integration
        caseCensus.push(
            {
                caseId: tempRowObject["Case\nId"],
                censusDate: currentDate,
                primaryMedicalHome: tempRowObject["Primary Medical Home"],
                mtt: tempRowObject["MTT/RA"],
                rn: tempRowObject["RN"],
                serviceCode: tempRowObject["Service \nCode"],
                coverageType: tempRowObject["Coverage\nType"],
                // Should be converted to date type
                dob: (tempRowObject["DOB"]),
                // Should be converted to integer
                los: (tempRowObject["LOS"]),
                dx: tempRowObject["DX"],
                vendorName: tempRowObject["Vendor Name"],
                // Should be converted to date time
                admitDate: (tempRowObject["Admit Date"]),
                // Should be converted to date
                lastReviewDate: (tempRowObject["last review date"]),
                // Should be converted to date
                lastCmDate: (tempRowObject["Last CMDate"]),
                notAuthorized: tempRowObject["Not Authorized"],
                lastPadReason: tempRowObject["Last PAD Reason"],
                // Should be converted to date time
                padReasonEnteredDate: (tempRowObject["PAD Reason entered date"]),
                levelOfCare: tempRowObject["Level of Care"],
                priorityLevel: tempRowObject["Priority Level"],
                reviewOutcome: tempRowObject["Review Outcome"],
                reviewOutcomeReason: tempRowObject["Review Outcome Reason"],
                // Should be converted to date
                enteredDate: (tempRowObject[" Entered Date"]),
                anticipatedDisposition: tempRowObject["Anticipated Disposition"],
                barriersToDisposition: tempRowObject["Barriers to Dispo"],
                stabilityOrderReceived: (tempRowObject["Stability Order Reveived "]),
                // Should be converted to date time
                stabilityNkfCmVerbal: (tempRowObject["StabilityOrder-NKF CM Verbal"]),
                sftEvent: tempRowObject["SFT Event"],
                // Should be converted to date time
                sftDateTime: (tempRowObject["SFT Date/Time"]),
                lastPertinentEventDate: tempRowObject["Last Pertinent Event Date"],
                stablePerOursMd: tempRowObject["Stable For Transfer Per OURS MD"],
                reason: tempRowObject["Reason"],
                // Should be converted to date
                authStartDate: (tempRowObject["Authorization Start Date"]),
                // Should be converted to date
                authEndDate: (tempRowObject["Authorization End Date"]),
                lastReviewRequired: (tempRowObject["Last Review Required By Date"]),
            }
        )
    }
    return { caseCensus, allColumnNames }
}
// This receives all cases that were parsed by excel. A for loop goes through each cases and adds it to each respective object depending on the filter. 
// ** EVERY TIME WE WANT TO CATEGORIZE SOMETHING ELSE, WE NEED TO DO THE FOLLOWING: 
// 1. add a new object within our case breakdown function that goes through cases. 
// 2. add the conditional to our for loop. 
// 3. Update type FullCategorizedInterface in interfaces.ts
// 4. Make sure return object in caseBreakdown function includes new category.
export function caseBreakdown(cases: CasesInterface[]) {
    const casesPerMtt: SingleCategoryInterface = {}
    const casesPerMedicalHome: SingleCategoryInterface = {}
    // for total case count
    let totalCaseCount = 0
    // For average length of stay
    let losAverage = 0
    const casesPerFacility: SingleCategoryInterface = {}
    const casesPerReviewOutcome: SingleCategoryInterface = {}
    const casesPerRN: SingleCategoryInterface = {}
    const casesPerCma: SingleCategoryInterface = {}
    const casesPerServiceCode: SingleCategoryInterface = {}
    const casesPerAnticipatedDispo: SingleCategoryInterface = {}
    // **** Currently we are just gathering stable cases based on OURS MD says stable. However, we can introduce further filtering if we want to check per medical home or add constraints to other things important.
    const stableCases: any = [];
    // at the moment we are appending the entire case into each object. one way to optimize would be just to append the reno key and then when it is called in main dashboard, we can pull all case info.
    for (let cs of cases) {
        totalCaseCount++;
        // increment to get total length of stay
        losAverage = losAverage + parseInt(cs.los)
        // medical home check
        if (casesPerMedicalHome[cs.primaryMedicalHome]) {
            casesPerMedicalHome[cs.primaryMedicalHome].push(cs);
        } else {
            casesPerMedicalHome[cs.primaryMedicalHome] = [cs];
        }
        // mtt check
        if (casesPerMtt[cs.mtt]) {
            casesPerMtt[cs.mtt].push(cs);
        } else {
            casesPerMtt[cs.mtt] = [cs];
        }

        // facility check
        if (casesPerFacility[cs.vendorName]) {
            casesPerFacility[cs.vendorName].push(cs);
        } else {
            casesPerFacility[cs.vendorName] = [cs];
        }
        // review outcome check
        if (casesPerReviewOutcome[cs.reviewOutcome]) {
            casesPerReviewOutcome[cs.reviewOutcome].push(cs);
        } else {
            casesPerReviewOutcome[cs.reviewOutcome] = [cs];
        }

        // per anticipated dispo
        if (cs.anticipatedDisposition && casesPerAnticipatedDispo[cs.anticipatedDisposition]) {
            casesPerAnticipatedDispo[cs.anticipatedDisposition].push(cs)
        } else if (cs.anticipatedDisposition) {
            casesPerAnticipatedDispo[cs.anticipatedDisposition] = [cs]
        }


        // rn + cma check
        if (casesPerRN[cs.rn] || casesPerCma[cs.rn]) {
            if (cmaCodes.includes(cs.rn)) {
                casesPerCma[cs.rn].push(cs)
            } else {
                casesPerRN[cs.rn].push(cs);
            }
        } else {
            if (cmaCodes.includes(cs.rn)) {
                casesPerCma[cs.rn] = [cs]
            } else {
                casesPerRN[cs.rn] = [cs];
            }
        }
        if (cs.stablePerOursMd != null && cs.stablePerOursMd == "Yes") {
            stableCases.push(cs)
        }

        // service code check
        if (casesPerServiceCode[cs.serviceCode]) {
            casesPerServiceCode[cs.serviceCode].push(cs);
        } else {
            casesPerServiceCode[cs.serviceCode] = [cs];
        }

        // stable case check
        if (cs.stablePerOursMd != null && cs.stablePerOursMd == "Yes") {
            stableCases.push(cs)
        }

    }
    losAverage = Math.floor(losAverage / totalCaseCount)
    const fullObject = {
        casesPerMtt,
        casesPerMedicalHome,
        totalCaseCount,
        losAverage,
        casesPerFacility,
        casesPerReviewOutcome,
        casesPerRN,
        casesPerServiceCode,
        stableCases,
        casesPerCma,
        casesPerAnticipatedDispo
    }
    console.log("Full object here", fullObject)
    return fullObject
}
export function caseToRechartFormat(cases: any) {

}