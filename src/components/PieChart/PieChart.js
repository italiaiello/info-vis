import React, { useRef, useEffect } from 'react';
import { select, arc, pie, scaleLinear } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

// https://www.youtube.com/watch?v=HLpw0JFY4-E&t=37s

const PieChart = ({ pieChartData, innerRadius, outerRadius }) => {

    // Pointers for the svg and wrapping article element respectively
    const pieChartRef = useRef()
    const wrapperRef = useRef()

    // Allows us to make the chart a bit more responsive
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
        const svg = select(pieChartRef.current)

        // If no dimensions or data is provided, the function will exit
        if (!dimensions) return
        if(pieChartData === undefined || !pieChartData.values || !pieChartData.labels) return
        if (innerRadius === undefined || outerRadius === undefined) return
        
        // Helps us to create the individual arcs for each data point
        const arcGenerator = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        const pieGenerator = pie()
        // Holds the information needed for the pieGenerator to work its magic
        const instructions = pieGenerator(pieChartData.values)
        console.log(instructions)


        // Creating the pie chart
        svg
            .selectAll(".slice")
            .data(instructions)
            .join("path")
            .attr("class", instruction => `slice value${instruction.value}`)
            .attr("stroke", "black")
            .attr("fill", "lightgray")
            .style(
                "transform",
                `translate(${dimensions.width / 2}px, ${dimensions.height / 2}px)`
            )
            .attr("d", instruction => arcGenerator(instruction))
            .on("mouseenter", (data) => {
                console.log(data)
                // Create tooltip
                svg
                    .selectAll(".tooltip")
                    .data([data])
                    .join(enter => enter.append("text"))
                    .attr("class", "tooltip")
                    .text(data.data)
                
                svg
                    .selectAll(`.value${data.value}`)
                    .attr("fill", "blue")
                
            })
            .on("mouseleave", () => {
                // Delete tooltip
                svg.select(".tooltip").remove()
                // Revert color back to grey
                svg.selectAll(`.slice`).attr("fill", "lightgray")
            })

    }, [pieChartData, dimensions, innerRadius, outerRadius])

    return (
    <article className="graph pieChart">
        <div ref={wrapperRef}>
            <svg ref={pieChartRef}></svg>
        </div>
        
    </article>
    )
}

export default PieChart