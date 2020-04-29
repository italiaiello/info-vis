import React, { useRef, useEffect } from 'react';
import { 
  select, 
  line, 
  curveCardinal, 
  axisBottom, 
  axisRight,
  scaleLinear } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

const LineGraph = ({ lineGraphData, setLineGraphData }) => {

    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
    const svg = select(svgRef.current)

    if (!dimensions) return

    const xScale = scaleLinear()
        .domain([0, lineGraphData.length - 1])
        .range([0, dimensions.width])

    const yScale = scaleLinear()
        .domain([0, 150])
        .range([dimensions.height, 0])

    const xAxis = axisBottom(xScale)
        .ticks(lineGraphData.length)
    svg
        .select(".x-axis")
        .style("transform", `translateY(${dimensions.height}px)`)
        .call(xAxis)

    const yAxis = axisRight(yScale)
    svg
        .select(".y-axis")
        .style("transform", `translateX(${dimensions.width}px)`)
        .call(yAxis)

    // generates the "d" attribute of a path element
    const myLine = line()
    .x((value, index) => xScale(index))
    .y(yScale)
    .curve(curveCardinal)

    // renders the path element and attaches the "d" 
    // attribute from line generator above
    svg
        .selectAll(".line")
        .data([lineGraphData])
        .join("path")
        .attr("class", "line")
        .attr("d", myLine)
        .attr("fill", "none")
        .attr("stroke", "blue")

    }, [lineGraphData, dimensions])

    return (
    <article className="graph lineGraph">
        <div ref={wrapperRef}>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
        <br />
        <div className="graphButtons">
            <button onClick={() => setLineGraphData(lineGraphData.map(value => value + 5))}>
                Update Data
            </button>
            <button onClick={() => setLineGraphData(lineGraphData.filter(value => value < 35))}>
                Filter Data
            </button>
        </div>
    </article>
    )
}

export default LineGraph