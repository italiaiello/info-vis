import React, { useRef, useEffect } from 'react';
import { select, arc, pie, scaleOrdinal } from 'd3';
import Legend from '../Legend/Legend'

import { useResizeObserver } from '../../hooks/useResizeObserver'

// https://www.youtube.com/watch?v=HLpw0JFY4-E&t=37s

const PieChart = ({ chartId, chartAlign, pieChartData, innerRadius, outerRadius }) => {

    // Pointers for the svg and wrapping article element respectively
    const pieChartRef = useRef()
    const wrapperRef = useRef()

    // Allows us to make the chart a bit more responsive
    const dimensions = useResizeObserver(wrapperRef)

    // Pie chart can only use numerical values, so we have to split up the data
    // into two variables. One will hold all the titles or keys, and the other
    // will hold all the values
    const pieChartKeys = Object.keys(pieChartData)
    const pieChartValues = Object.values(pieChartData)

    // will be called initially and then every time the data array changes
    useEffect(() => {
        const svg = select(pieChartRef.current)

        // If no dimensions or props are provided, the function will exit
        if (!dimensions || !pieChartKeys.length || !pieChartValues.length) return
        if (innerRadius === undefined || outerRadius === undefined) return


        
        
        // Helps us to create the individual arcs for each data point
        const arcGenerator = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        const pieGenerator = pie()
        // Holds the information needed for the pieGenerator to work its magic
        const instructions = pieGenerator(pieChartValues)

        const colorScale = scaleOrdinal()
            .domain(pieChartValues)
            // Change colors here
            .range(["#EC8C86", "#B53731", "#69201C"]);
        
        // Creating the pie chart
        svg
            .selectAll(".slice")
            .data(instructions)
            .join("path")
            // Gave each slice a class of value + the number of victims
            // E.g. value157
            // This will help us target specific slices
            .attr("class", instruction => `slice value${instruction.value}`)
            // .attr("stroke", "black")
            .attr("fill", instruction => colorScale(instruction.value))
            .style(
                "transform",
                `translate(${dimensions.width / 2}px, ${dimensions.height / 2}px)`
            )
            .attr("d", instruction => arcGenerator(instruction))
            .on("mouseenter", (data) => {

                console.log(data)
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

                // Capitalises first letter of label and attaches it to the rest of the word
                const upperCaseLetter = pieChartKeys[labelIndex].charAt(0).toUpperCase()
                const restOfWord = pieChartKeys[labelIndex].substring(1)
                
                pieChartKeys[labelIndex] = `${upperCaseLetter}${restOfWord}`

                const text = document.getElementById(chartId)
                text.textContent = `${pieChartKeys[labelIndex]}: ${pieChartValues[labelIndex]}`
                
                // Selects the slice we are currently hovering over and change the color
                svg
                    .select(`.value${data.value}`)
                    .attr("fill", "#E8483F")
                
            })
            .on("mouseleave", (data) => {
                // Revert tooltip text back to original
                const text = document.getElementById(chartId)
                text.textContent = 'Hover over a slice'
                // Reverts colors back to the original ones (red, green, blue)
                svg.selectAll(`.slice`).attr("fill", data => colorScale(data.value))
            })

    }, [pieChartData, dimensions, innerRadius, outerRadius, chartId, chartAlign, pieChartKeys, pieChartValues])

    return (
    <article className="graph pieChart">
        <Legend keys={pieChartKeys} colors={["#EC8C86", "#B53731", "#69201C"]} />
        <div ref={wrapperRef}>
            <svg ref={pieChartRef}></svg>
        </div>
        <div className="tooltipBox">
            <p id={chartId}>Hover over a slice</p>
        </div>
    </article>
    )
}

export default PieChart