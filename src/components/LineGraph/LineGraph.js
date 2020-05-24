import React, { useRef, useEffect } from 'react';
import {  select, line, axisBottom, axisRight, scaleLinear } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

const LineGraph = ({ lineGraphData, yAxisMax, reverseData, xAxisFontSize }) => {

    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
    const svg = select(svgRef.current)

    if (!dimensions || lineGraphData === undefined || xAxisFontSize === undefined) return
    
    let keys = Object.keys(lineGraphData)
    let values = Object.values(lineGraphData)

    if (reverseData !== undefined && reverseData === true) {
        keys = keys.reverse()
        values = values.reverse()
    }

    const xScale = scaleLinear()
        .domain([0, keys.length - 1])
        .range([0, dimensions.width])

    const yScale = scaleLinear()
        .domain([0, yAxisMax])
        .range([dimensions.height, 0])

    const xAxis = axisBottom(xScale)
        .ticks(keys.length)
        .tickFormat(index => keys[index])

    
    svg
        .select(".x-axis")
        .style("transform", `translateY(${dimensions.height}px)`)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .style("font-size", xAxisFontSize !== undefined ? `${xAxisFontSize}px` : "")


    const yAxis = axisRight(yScale)
    svg
        .select(".y-axis")
        .style("transform", `translateX(${dimensions.width}px)`)
        .call(yAxis)

    // generates the "d" attribute of a path element
    const myLine = line()
    .x((value, index) => xScale(index))
    .y(yScale)

    // renders the path element and attaches the "d" 
    // attribute from line generator above
    svg
        .selectAll(".line")
        .data([values])
        .join("path")
        .attr("class", "line")
        .on("mouseenter", value => console.log(value))
        .attr("d", myLine)
        .attr("fill", "none")
        .attr("stroke", "#DA0000")

    }, [lineGraphData, reverseData, yAxisMax, xAxisFontSize, dimensions])

    return (
    <article className="graph lineGraph">
        <h3 id="part4-1">Number of mass shootings recorded per year</h3>
        <div ref={wrapperRef}>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
        <div id="lineTooltip" className="tooltip">
            <p id="pointInfo"></p>
        </div>
    </article>
    )
}

export default LineGraph