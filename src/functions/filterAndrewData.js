import { bindDCDataToGeoJson } from './filterDCData'

export const filterCasualtyData = (data) => {
    // Extracting the number of victims associated with each cause
    const causesFreq = {}
    for (let i = 0; i < data.length; i++) {
        const currentCause = data[i].Cause
        // If we haven't come across the current cause yet, add it in
        // Then make it equal to the 'Total victims' value for that row
        if (causesFreq[currentCause] === undefined) {
            causesFreq[currentCause] = +data[i]["Total victims"]
        } else {
            // Otherwise, increment the existing value by the current 'Total victims' value
            causesFreq[currentCause] += +data[i]["Total victims"]
        }
    }

    // Since I had filtered out all the unknown causes, we can find how many there
    // by minussing the number of filtered data rows from the main file's rows
    // Main file = 323 rows

    causesFreq["unknown"] = 323 - data.length

    return causesFreq
}

export const filterCulpritDemographicData = (data) => {
    let yearlyDemographics = []
    
    // 2017 - 1966 is 51, and we can use this to loop over the data one time per year
    for (let i = 0, currentYear = 17; i < 52; i++) {
        let shootingsOnThisYear = []
        // Sifting through 2000s data
        if (currentYear < 65 && currentYear >= 0) {
            shootingsOnThisYear = data.filter(shooting => {
                const year = shooting.Date.split("/")[2]
                if (year === `${2000 + currentYear}` || +year === currentYear) {
                    return true
                }
                return false
            })
        // Sifting through 1900s data
        } else {
            shootingsOnThisYear = data.filter(shooting => {
                const year = shooting.Date.split("/")[2]
                if (year === `${1900 + currentYear}` || +year === currentYear) {
                    return true
                }
                return false
            })
        }

        // Adding all the yearly shootings into one place
        // Made a function (down below) that counts the demographics
        yearlyDemographics.push(countDemographicFrequency(shootingsOnThisYear))
        // Updating year property within the object so we can use it for the
        // x-axis of stacked bar graph
        if (currentYear < 65 && currentYear >= 0) {
            yearlyDemographics[yearlyDemographics.length - 1].year = 2000 + currentYear
        } else {
            yearlyDemographics[yearlyDemographics.length - 1].year = 1900 + currentYear
        }
        
        // Move to the next year
        currentYear -= 1

        // If we are done with 2000s, start with the 1900s
        if (currentYear < 0) {
            currentYear = 99
        }

    }

    return yearlyDemographics.reverse()

}

// Helper function for the function above
const countDemographicFrequency = (shootingsForYear, currentYear) => {

    // Object that keeps track of demographic frequency for the current year
    let demographics = {
        year: 0,
        kidsAndTeenagers: 0,
        youngAdults: 0,
        adults: 0,
        middleAged: 0
    }

    // Loop over each row associated with the current year and map the ages
    // to the object above
    shootingsForYear.map(shooting => {
        const age = +shooting.Age

        if (age > 0 && age <= 19) {
            demographics["kidsAndTeenagers"] += 1
        } else if (age >= 20 && age < 34) {
            demographics["youngAdults"] += 1
        } else if (age >= 35 && age < 45) {
            demographics["adults"] += 1
        } else {
            demographics["middleAged"] += 1
        }
        return shooting
        
    })

    // Demographic data is ready to be pushed to the array
    return demographics
}

// Grabbing the data for the targets of shootings
export const filterShootingTargetData = (data) => {
    const shootingTargets = {}
    // Remove unknown target values by only keeping strings with at least one character
    const filteredData = data.filter(row => row.Target.length)

    for (let i = 0; i < filteredData.length; i++) {
        // Check if current row's target is random
        if (filteredData[i].Target.toLowerCase() === "random") {
            // If so, increment the 'random' key value in shootingTargets
            if (shootingTargets["random"] === undefined) {
                shootingTargets["random"] = 1
            } else {
                shootingTargets["random"] += 1
            }
        } else {
            // Otherwise, increment the 'targeted' value
            if (shootingTargets["targeted"] === undefined) {
                shootingTargets["targeted"] = 1
            } else {
                shootingTargets["targeted"] += 1
            }
        }
    }

    // Now that we have extracted all the random and targeted shootings
    // we have to add the ones that were unknown
    // To do this we grab all the rows that didn't have a target defined
    const unknownData = data.filter(row => !row.Target.length)
    
    // And now we just add the number of unknown rows to the shootingTargets object
    shootingTargets["unknown"] = unknownData.length
    
    return shootingTargets
}

// Grabs the number of shooters with a military background
export const filterMilitaryCulprits = (data) => {
    // The main csv file has 323 rows
    // I have already filtered out the shooters with a military background and 
    // placed them in their own csv file (called militaryShooters.csv)
    // So now I just have to minus the number of rows of the filtered file from
    // the main file

    const difference  = 323 - data.length

    // Now I can create an object that will be used to populate the pie chart

    const finalData = {
        military: data.length,
        other: difference
    }

    return finalData

}

export const updateGeoJsonData = (geoJson, victims, targets) => {
    // Make a copy of the geoJson data
    let updatedData = [...geoJson.features]

    // Add shooting data to the respective U.S. state properties
    // This binds DC's data
    bindDCDataToGeoJson(updatedData, victims, targets)

    return updatedData
}

export const filterStackedBarGraph = (data, property, startOfRange, endOfRange) => {
    
    const filteredData = data.filter(object =>  object[property] >= startOfRange &&
                                                object[property] <= endOfRange)

    return filteredData
}