import React, { useRef, useEffect } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'


const AnimatedBarGraph = ({ barGraphData }) => {
    
    const barGraphRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    console.log(barGraphData)

    // will be called initially and then every time the barGraphData array changes
    useEffect(() => {
        const svg = select(barGraphRef.current)

        if (!dimensions) return
        if (!barGraphData.labels || !barGraphData.values) return

        // Setting up the x and y scales, which help us spread each point eveny across
        // the width and height of the svg respectively
        const xScale = scaleBand()
            .domain(barGraphData.labels)
            .range([0, dimensions.width])
            .padding(0.5)

            // Finding the max value from the data and using it as the max for the y axis
        const maxYAxisValue = barGraphData.values.reduce((sum, value) => sum += value)
        const yScale = scaleLinear()
            .domain([0, maxYAxisValue])
            .range([dimensions.height, 0])

        // Setting up the color scale
        // I mapped colors to the lowest and highest value of the data
        const maxDataValue = Math.max(...barGraphData.values)
        const colorScale = scaleLinear()
            .domain([0, maxDataValue])
            .range(["#ff8780", "#ff473d"])
            .clamp(true)

        // Setting up the x and y axes
        const xAxis = axisBottom(xScale)
        svg
            .select(".x-axis")
            .style("transform", `translateY(${dimensions.height}px)`)
            .call(xAxis)

        const yAxis = axisRight(yScale)
        svg
            .select(".y-axis")
            .style("transform", `translateX(${dimensions.width}px)`)
            .call(yAxis)

        // Displaying the individual bars onto the graph
        svg
            .selectAll(".bar")
            .data(barGraphData.values)
            .join("rect")
            .attr("class", "bar")
            .style("transform", "scale(1, -1)")
            .attr("x", (value, index) => xScale(barGraphData.labels[index]))
            .attr("y", -dimensions.height)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (value, index) => {
                // xScale(index) wasn't working so I had to make a work around
                // I selected all the elements with the class '.bar'
                // Then, by using 'index', I can select the 'x' attribute of a specific bar
                // This value is used further down to centre the tooltip text
                let xValueOfRect = +document.querySelectorAll(".bar")[index].getAttribute("x")
                svg
                    .selectAll(".tooltip")
                    .data([value])
                    .join(enter => enter.append("text").attr("y", yScale(value) - 4))
                    .attr("class", "tooltip")
                    .text(value)
                    .attr("x", xValueOfRect + xScale.bandwidth() / 2)
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
        </article>
    );
}

export default AnimatedBarGraph