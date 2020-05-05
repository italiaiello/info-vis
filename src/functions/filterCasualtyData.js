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

    // Now that we have the data filtered, we need to separate the keys and values
    // This is because the pie chart needs the label and value separated
    const keys = Object.keys(causesFreq)
    const values = Object.values(causesFreq)

    // Since both of the above arrays are the same length, just loop over one 
    // (values array in this case) and use the same index to grab values from the other array
    const finalData = values.map((value, i) => (
        {
            label: keys[i],
            value: value
        }
    ))

    console.log(finalData)

    return finalData
}