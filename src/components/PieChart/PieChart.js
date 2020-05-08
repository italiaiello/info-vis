import React, { useRef, useEffect } from 'react';
import { select, arc, pie } from 'd3';

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
        if(pieChartData === undefined) return
        if (innerRadius === undefined || outerRadius === undefined) return

        const pieChartKeys = Object.keys(pieChartData)
        const pieChartValues = Object.values(pieChartData)
        
        // Helps us to create the individual arcs for each data point
        const arcGenerator = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        const pieGenerator = pie()
        // Holds the information needed for the pieGenerator to work its magic
        const instructions = pieGenerator(pieChartValues)
        
        // Creating the pie chart
        // Gave each slice a class of value + the number of victims
        // E.g. value157
        // This will help us target specific slices
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

                // We need to grab the label that corresponds to the numerical value
                // Just made some variables to make it easier to access the 
                // labels and values arrays
                let labelIndex = -1

                // Loop through values array until we find a matching value,
                // then assign the index of that element to labelIndex
                for (let i = 0; i < pieChartValues.length; i++) {
                    if (pieChartValues[i] === data.data) {
                        labelIndex = i
                        break;
                    }
                }

                if (labelIndex < 0) return

                // Capitalise first letter of label and attach it to the rest of the word
                const upperCaseLetter = pieChartKeys[labelIndex].charAt(0).toUpperCase()
                const restOfWord = pieChartKeys[labelIndex].substring(1)
                
                pieChartKeys[labelIndex] = `${upperCaseLetter}${restOfWord}`

                // Create tooltip
                svg
                    .selectAll(".tooltip")
                    .data([data])
                    .join(enter => enter.append("text"))
                    .attr("class", "tooltip")
                    .attr("x", dimensions.width - (dimensions.width / 3))
                    .attr("y", dimensions.height / 2)
                    .text(`${pieChartKeys[labelIndex]}: ${pieChartValues[labelIndex]} Shootings`)
                
                // Select the slice we are currently hovering over and change the color
                svg
                    .select(`.value${data.value}`)
                    .attr("fill", "#3d3d3d")
                
            })
            .on("mouseleave", () => {
                // Remove tooltip
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