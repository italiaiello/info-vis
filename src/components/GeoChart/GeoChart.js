import React, { useRef, useEffect, useState } from 'react'
import { select, geoPath, geoMercator, min, max, scaleLinear } from 'd3'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { updateGeoJsonData } from '../../functions/andrewsFunctions'

// https://exploratory.io/map

const GeoChart = ({ data, shootingsPerState, property }) => {
    const geoChartRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        const svg = select(geoChartRef.current)

        const updatedFeaturesData = updateGeoJsonData(data, shootingsPerState)

        // use resixed dimensions
        // but fallback on getBoundingClientRect if there are no dimensions yet
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()

        const minProp = min(updatedFeaturesData, feature => feature.properties[property])
        const maxProp = max(updatedFeaturesData, feature => feature.properties[property])
        const colorScale = scaleLinear()
            .domain([minProp, maxProp])
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
            .on("click", feature => {
                console.log(feature)
                setSelectedCountry(selectedCountry === feature ? null : feature)
            }
            )
            .transition()
            .duration(1000)
            .attr("fill", feature => feature.properties[property] !== undefined 
                                        ? colorScale(feature.properties[property])
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
                `${feature.properties.NAME}: ${feature.properties[property]}`
            )
            .attr("x", 10)
            .attr("y", 25)

    }, [data, dimensions, property, selectedCountry, shootingsPerState])
    

    return (
        <div ref={wrapperRef} className="geoChart">
            <svg ref={geoChartRef}></svg>
        </div>
    )
}

export default GeoChart