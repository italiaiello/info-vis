
// Binding the data from DC's data to the main geoJson object imported into the App.js file
export const bindDCDataToGeoJson = (updatedData, victims) => {
    for (let i = 0; i < updatedData.length; i++) {
        const state = updatedData[i].properties.NAME
        if (victims[state] === undefined) {
            updatedData[i].properties["shootings"] = 0
            updatedData[i].properties["fatalities"] = 0
            updatedData[i].properties["injuries"] = 0
            updatedData[i].properties["policemenKilled"] = 0
            updatedData[i].properties["totalVictims"] = 0
        } else {
            updatedData[i].properties["shootings"] = victims[state].shootings
            updatedData[i].properties["fatalities"] = victims[state].fatalities
            updatedData[i].properties["injuries"] = victims[state].injuries
            updatedData[i].properties["policemenKilled"] = victims[state].policemenKilled
            updatedData[i].properties["totalVictims"] = victims[state].totalVictims
        }
        
    }

    return updatedData
}

export const filterVictimsData = (data) => {
    const filteredData = {}

    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const state = row.States
        filteredData[state] = {
            shootings: +row["Number of mass shootings"],
            fatalities: +row.Fatalities,
            injuries: +row.Injured,
            policemenKilled: +row["Policemen Killed"],
            totalVictims: +row["Total victims"]
        }
    }

    return filteredData
}