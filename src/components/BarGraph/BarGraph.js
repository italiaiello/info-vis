import React, { useRef, useEffect } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'


const AnimatedBarGraph = ({ barClassName, barGraphData }) => {
    
    const barGraphRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the barGraphData array changes
    useEffect(() => {
        const svg = select(barGraphRef.current)

        const values = Object.values(barGraphData)

        if (!dimensions || values.length === 0) return

        // Finding the max value from the data and using it as the max for the y axis
        const maxYAxisValue = values.reduce((sum, value) => sum += value)
        // Splitting the keys and values into two variables
        const dataKeys = Object.keys(barGraphData)
            // Turning values into percentages
        const dataValues = Object.values(barGraphData).map(value => Math.round((value / maxYAxisValue) * 100))

        if (dataKeys.length === 0 || dataValues.length === 0) return


        // Setting up the x and y scales, which help us spread each point eveny across
        // the width and height of the svg respectively
        const xScale = scaleBand()
            .domain(dataKeys)
            .range([0, dimensions.width])
            .padding(0.5)

            
        
        const yScale = scaleLinear()
            .domain([0, 100])
            .range([dimensions.height, 0])

        // Setting up the color scale
        // I mapped colors to the lowest and highest value of the data
        const maxDataValue = Math.max(...dataValues)
        const colorScale = scaleLinear()
            .domain([0, maxDataValue])
            // Change colors here
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
            .selectAll(`.${barClassName}`)
            .data(dataValues)
            .join("rect")
            .attr("class", barClassName)
            .style("transform", "scale(1, -1)")
            .attr("x", (value, index) => xScale(dataKeys[index]))
            .attr("y", -dimensions.height)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (value, index) => {
                // xScale(index) wasn't working so I had to make a work around
                // I selected all the elements with the class '.bar'
                // Then, by using 'index', I can select the 'x' attribute of a specific bar
                // This value is used further down to centre the tooltip text
                let xValueOfRect = +document.querySelectorAll(`.${barClassName}`)[index].getAttribute("x")
                svg
                    .selectAll(".tooltip")
                    .data([value])
                    .join(enter => enter.append("text").attr("y", yScale(value) - 4))
                    .attr("class", "tooltip")
                    .text(`${value}%`)
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

    }, [barGraphData, barClassName, dimensions])

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