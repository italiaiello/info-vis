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

    // Returns only the total number of victims for each category
    // So we will just have an array of numbers
    return Object.values(causesFreq)
}