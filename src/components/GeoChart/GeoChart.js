import React, { useRef, useEffect, useState } from 'react'
import { select, geoPath, geoMercator, min, max, scaleLinear, event } from 'd3'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { updateGeoJsonData } from '../../functions/filterAndrewData'

// Where I got the GeoMap from: https://exploratory.io/map


const GeoChart = ({ data, victimsPerState, targetsPerState, property, isTargetsOptionSelected, selectedTargetIndex }) => {
    const geoChartRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        const svg = select(geoChartRef.current)

        if (!dimensions || targetsPerState === undefined || victimsPerState === undefined) return

        const updatedFeaturesData = updateGeoJsonData(data, victimsPerState, targetsPerState)

        // use resixed dimensions
        // but fallback on getBoundingClientRect if there are no dimensions yet
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()

        if (updatedFeaturesData === undefined) return


        const setMax = () => {
            
            return max(updatedFeaturesData, feature => {
                const targets = feature.properties.targets
                return targets === 0 ? 0 : feature.properties.targets[selectedTargetIndex].victims
            })
            
        }

        const minProp = min(updatedFeaturesData, feature => feature.properties[property])
        const maxProp = max(updatedFeaturesData, feature => feature.properties[property])

        let maxPropTargets = setMax() 
        if (maxPropTargets === 0) {
            maxPropTargets = 1
        }


        
        const colorScale = scaleLinear()
            .domain(isTargetsOptionSelected ? [0, maxPropTargets] : [minProp, maxProp])
            // Change colors here
            .range(["#f8cccc", "#DA0000"])

        // Projects coordinates on a 2D plane
        const projection = geoMercator()
            .fitSize([width, height], selectedCountry || data)
            .precision(100)

        // Takes geojson data,
        // Transforms that into the d attribute of a path element
        const pathGenerator = geoPath().projection(projection)

        
        const setTooltipText = feature => {
            const targets = feature.properties.targets
            const formattedProperty = property.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
            let targetsText = ""
            let number = 0
            if (targets !== 0) {
                targetsText = `${targets[selectedTargetIndex].target.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()}`
                number = targets[selectedTargetIndex].victims
            } else {
                targetsText = "Unknown"
            }
            return !isTargetsOptionSelected 
                ?
                `${feature.properties.NAME}: ${feature.properties[property]} 
                ${formattedProperty}`
                :
                (   
                    targetsText !== "Unknown" ?
                    `${feature.properties.NAME}: ${number} had ${targetsText} as a target`
                    :
                    targetsText
                )
            
        }

        const setFillOfMap = feature => {
            if (isTargetsOptionSelected) { 
                console.log(feature, property, selectedTargetIndex)
                if (feature.properties.targets !== undefined) {
                    const targetValue = feature.properties.targets
                    return targetValue === 0 
                        ?
                        colorScale(targetValue)
                        :
                        colorScale(targetValue[selectedTargetIndex].victims)
                    // colorScale(target)
                } else {
                    return "light"
                }
            } else {

               return feature.properties[property] !== undefined 
                    ? colorScale(feature.properties[property])
                    // Change color for undefined values
                    : "light"
            }
                        
        }
        
     // set position etc.

        // Render each country
        svg
            .selectAll(".country")
            .data(data.features)
            .join("path")
            .attr("class", "country")
            .on("mouseenter", feature => {
                svg
                    .selectAll(".geoTooltip")
                    .data([feature])
                    .join(enter => enter.append("text"))
                    .attr("class", "geoTooltip")
                    .attr("x", event.pageX - 100)
                    .attr("y", event.pageY - 180)
                    .text(setTooltipText(feature))
                
                // Selects the slice we are currently hovering over and change the color
                svg
                    .select(`.value${data.value}`)
                    .attr("fill", "#3d3d3d")

            })
            .on("mouseleave", feature => {
                // Removes tooltip
                svg.select(".geoTooltip").remove()
                // Reverts colors back to the original ones (red, green, blue)
                svg.selectAll(`.slice`).attr("fill", feature => colorScale(feature.value))
            })
            .on("click", feature => {
                console.log(feature)
                setSelectedCountry(selectedCountry === feature ? null : feature)
            }
            )
            .transition()
            .duration(1000)
            .attr("fill", feature => setFillOfMap(feature))
            .attr("d", feature => pathGenerator(feature))
            

    }, [data, dimensions, property, selectedCountry, victimsPerState, targetsPerState, isTargetsOptionSelected, selectedTargetIndex])


    return (
        <div ref={wrapperRef} className="graph geoChart">
            <svg ref={geoChartRef}>
            </svg>
            <div className="geoChartInfoContainer">
            {
                selectedCountry !== null &&
                <div className="geoChartInfo">
                    <p className="infoTitle">{`${selectedCountry.properties.NAME} Statistics:`}</p>
                    <p>{`Shootings: ${selectedCountry.properties.shootings}`}</p>
                    <p>{`Fatalities: ${selectedCountry.properties.fatalities}`}</p>
                    <p>{`Injuries: ${selectedCountry.properties.injuries}`}</p>
                    <p>{`Policemen Killed: ${selectedCountry.properties.policemenKilled}`}</p>
                    <p>{`Total Victims: ${selectedCountry.properties.totalVictims}`}</p>
                </div>
                
                    
            }
            </div>
        </div>
    )
}

export default GeoChart