import React, { useRef, useEffect, useState } from 'react'
import { select, geoPath, geoMercator, min, max, scaleLinear, event } from 'd3'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { updateGeoJsonData } from '../../functions/filterAndrewData'

// Where I got the GeoMap from: https://exploratory.io/map


                    // These are what was passed in from App.js
const GeoChart = ({ data, victimsPerState, property }) => {
    const geoChartRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        const svg = select(geoChartRef.current)

        let updatedFeaturesData = updateGeoJsonData(data, victimsPerState)

        // use resixed dimensions
        // but fallback on getBoundingClientRect if there are no dimensions yet
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()

        const minProp = min(updatedFeaturesData, feature => feature.properties[property])
        const maxProp = max(updatedFeaturesData, feature => feature.properties[property])
        
        const colorScale = scaleLinear()
            .domain([minProp, maxProp])
            // Change colors here
            .range(["#ccc", "red"])

        // Projects coordinates on a 2D plane
        const projection = geoMercator()
            .fitSize([width, height], selectedCountry || data)
            .precision(100)

        // Takes geojson data,
        // Transforms that into the d attribute of a path element
        const pathGenerator = geoPath().projection(projection)

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
                    .attr("x", event.pageX)
                    .attr("y", event.pageY - 100)
                    .text(`${feature.properties.NAME}: ${feature.properties[property]} 
                            ${property.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()}`)
                
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
            .attr("fill", feature => feature.properties[property] !== undefined 
                                        ? colorScale(feature.properties[property])
                                        // Change color for undefined values
                                        : "light"
                                        )
            .attr("d", feature => pathGenerator(feature))

        
        // Render text
        svg
            .selectAll(".label")
            .data([selectedCountry])
            .join("text")
            .attr("class", "label")
            .text(
                feature => feature && 
                `${feature.properties.NAME} Statistics
                Shootings: ${feature.properties.shootings}`
            )
            .attr("x", 10)
            .attr("y", 25)

    }, [data, dimensions, property, selectedCountry, victimsPerState])
    

    return (
        <div ref={wrapperRef} className="geoChart">
            <svg ref={geoChartRef}></svg>
        </div>
    )
}

export default GeoChart