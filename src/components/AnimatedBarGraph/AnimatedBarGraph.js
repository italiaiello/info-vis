import React, { useRef, useEffect } from 'react';
import { 
    select, 
    axisBottom, 
    axisRight,
    scaleLinear, 
    scaleBand } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'


const AnimatedBarGraph = ({ barGraphData, setBarGraphData }) => {
    
    const barGraphRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the barGraphData array changes
    useEffect(() => {
        const svg = select(barGraphRef.current)

        if (!dimensions) return

        const xScale = scaleBand()
            .domain(barGraphData.map((value, index) => index))
            .range([0, dimensions.width])
            .padding(0.5)

        const yScale = scaleLinear()
            .domain([0, 150])
            .range([dimensions.height, 0])

        const colorScale = scaleLinear()
            .domain([75, 100, 150])
            .range(["green", "orange", "red"])
            .clamp(true)

        const xAxis = axisBottom(xScale).ticks(barGraphData.length)
        svg
            .select(".x-axis")
            .style("transform", `translateY(${dimensions.height}px)`)
            .call(xAxis)

        const yAxis = axisRight(yScale)
        svg
            .select(".y-axis")
            .style("transform", `translateX(${dimensions.width}px)`)
            .call(yAxis)

        svg
            .selectAll(".bar")
            .data(barGraphData)
            .join("rect")
            .attr("class", "bar")
            .style("transform", "scale(1, -1)")
            .attr("x", (value, index) => xScale(index))
            .attr("y", -dimensions.height)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (value, index) => {
                svg
                    .selectAll(".tooltip")
                    .data([value])
                    .join(enter => enter.append("text").attr("y", yScale(value) - 4))
                    .attr("class", "tooltip")
                    .text(value)
                    .attr("x", xScale(index) + xScale.bandwidth() / 2)
                    .attr("text-anchor", "middle")
                    .transition()
                    .attr("y", yScale(value) - 8)
                    .attr("opacity", 1)

            })
            .on("mouseleave", () => svg.select(".tooltip").remove())
            .transition()
            .attr("fill", colorScale)
            .attr("height", value => dimensions.height - yScale(value))

    }, [barGraphData, dimensions])

    return (
        <article className="graph barGraph">
            <div ref={wrapperRef}>
                <svg ref={barGraphRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
            <br />
            <div className="graphButtons">
                <button onClick={() => setBarGraphData(barGraphData.map(value => value < 150 && value + 5))}>
                    Update Data
                </button>
                <button onClick={() => setBarGraphData(barGraphData.filter(value => value < 35))}>
                    Filter Data
                </button>
                <button onClick={() => setBarGraphData([...barGraphData, Math.round(Math.random(0, 1) * 150)])}>
                    Add Data
                </button>
            </div>
        </article>
    );
}

export default AnimatedBarGraph