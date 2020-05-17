
// Binding the data from DC's data to the main geoJson object imported into the App.js file
export const bindDCDataToGeoJson = (updatedData, victims, targets) => {
    bindVictimsData(updatedData, victims)
    bindTargetsData(updatedData, targets)

    return updatedData
}

const bindVictimsData = (updatedData, victims) => {
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

const bindTargetsData = (updatedData, targets) => {
    for (let i = 0; i < updatedData.length; i++) {
        const state = updatedData[i].properties.NAME
        if (targets[state] === undefined) {
            updatedData[i].properties["targets"] = 0
        } else {
            updatedData[i].properties["targets"] = targets[state]
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

export const filterTargetsData = (data) => {
    // Filter the data so that each state has the data all targets
    const stateTargets = {}
    const filteredData = Object.keys(data[0]).filter(key => key !== "Target")
    filteredData.forEach(key => {
        Object.defineProperty(stateTargets, `${key}`, {
            value : data.map(row => (
                row[key] !== ""
                ?
                {
                    target: row.Target,
                    victims: +row[key]
                }
                :
                {
                    target: row.Target,
                    victims: 0
                }
            )),
            writable : true,
            enumerable : true,
            configurable : true
        })}
    )
    
    return stateTargets

}

export const parseClosedOpenData = (data) => {
    const parsedData = data.map(row => (
        {
            space: row.Space,
            fatalities: parseFloat(row.Fatalities),
            injured: parseFloat(row.Injured),
            totalVictims: parseFloat(row["Total victims"])

        }
    ))

    return parsedData
}