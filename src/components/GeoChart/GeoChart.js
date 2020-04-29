import React, { useRef, useEffect, useState } from 'react'
import { select, geoPath, geoMercator, min, max, scaleLinear } from 'd3'
import { useResizeObserver } from '../../hooks/useResizeObserver'

const GeoChart = ({ data, property, setProperty }) => {
    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        const svg = select(svgRef.current)

        // use resixed dimensions
        // but fallback on getBoundingClientRect if there are no dimensions yet
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect

        const minProp = min(data.features, feature => feature.properties[property])
        const maxProp = max(data.features, feature => feature.properties[property])
        const colorScale = scaleLinear()
            .domain([minProp, maxProp])
            .range(["#ccc", "red"])

        // Projects coordinates on a 2D plane
        const projection = geoMercator().fitSize([width, height], 
            selectedCountry || data)

        // Takes geojson data,
        // Transforms that into the d attribute of a path element
        const pathGenerator = geoPath().projection(projection)

        console.log(data.features)

        svg
            .selectAll(".country")
            .data(data.features)
            .join("path")
            .attr("class", "country")
            .on("click", feature => 
                setSelectedCountry(selectedCountry === feature ? null : feature)
            )
            .transition()
            .attr("fill", feature => colorScale(feature.properties[property]))
            .attr("d", feature => pathGenerator(feature))

    }, [data, dimensions, property, selectedCountry])

    

    return (
        <div ref={wrapperRef} className="geoChart">
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default GeoChart