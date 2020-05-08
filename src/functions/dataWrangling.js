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

    const keys = Object.keys(causesFreq)
    const totalValues = Object.values(causesFreq)

    const finalData = {
        labels: keys,
        values: totalValues
    }

    // Returns only the total number of victims for each category
    // So we will just have an array of numbers
    return finalData
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