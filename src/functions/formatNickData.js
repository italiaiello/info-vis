export const formatNickData = (data) => {
    const formattedData = {}
    
    for (let i = 0; i < data.length; i++) {
        const cause = data[i].Cause
        const numShooters = data[i].NumShooters
        formattedData[cause] = +numShooters
    }

    return formattedData
}