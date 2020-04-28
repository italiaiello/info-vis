import React, {useRef, useEffect, useState} from 'react';
import { 
    select, 
    axisBottom, 
    axisRight,
    scaleLinear, 
    scaleBand } from 'd3';

const AnimatedBarGraph = () => {
    const [data, setData] = useState([20, 30, 45, 60, 20, 65, 75])
    const barGraphRef = useRef()

    // will be called initially and then every time the data array changes
    useEffect(() => {
    const svg = select(barGraphRef.current)
    const xScale = scaleBand()
        .domain(data.map((value, index) => index))
        .range([0, 300])
        .padding(0.5)

    const yScale = scaleLinear()
        .domain([0, 150])
        .range([150, 0])

    const colorScale = scaleLinear()
        .domain([75, 100, 150])
        .range(["green", "orange", "red"])
        .clamp(true)

    const xAxis = axisBottom(xScale).ticks(data.length)
    svg
        .select(".x-axis")
        .style("transform", "translateY(150px)")
        .call(xAxis)

    const yAxis = axisRight(yScale)
    svg
        .select(".y-axis")
        .style("transform", "translateX(300px)")
        .call(yAxis)

    svg
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .style("transform", "scale(1, -1)")
        .attr("x", (value, index) => xScale(index))
        .attr("y", -150)
        .attr("width", xScale.bandwidth())
        .transition()
        .attr("fill", colorScale)
        .attr("height", value => 150 - yScale(value))

    }, [data])

    return (
        <article className="graph barGraph">
        <svg ref={barGraphRef}>
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
        <br />
        <button onClick={() => setData(data.map(value => value + 5))}>
            Update Data
        </button>
        <button onClick={() => setData(data.filter(value => value < 35))}>
            Filter Data
        </button>
        </article>
    );
}

export default AnimatedBarGraph