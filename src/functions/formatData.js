export const formatData = (data, propertyString, valueString) => {
    const formattedData = {}
    
    for (let i = 0; i < data.length; i++) {
        const property = data[i][propertyString]
        const value = data[i][valueString]
        formattedData[property] = +value
    }

    return formattedData
}