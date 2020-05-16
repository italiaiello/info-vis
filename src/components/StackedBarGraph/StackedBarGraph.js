import React, { useRef, useEffect } from 'react';
import { select, scaleBand, axisBottom, axisLeft, stack, scaleLinear } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

// Tutorial: https://www.youtube.com/watch?v=bXN9anQN_kQ&list=PLDZ4p-ENjbiPo4WH7KdHjh_EMI7Ic8b2B&index=16

const StackedBarGraph = ({ stackedBarGraphData, keys, colors }) => {

    console.log(stackedBarGraphData)

    // Pointers for the svg and wrapping article element respectively
    const stackedGraphRef = useRef()
    const wrapperRef = useRef()

    // Allows us to make the chart a bit more responsive
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
        const svg = select(stackedGraphRef.current)
        const { width, height } =  
            dimensions || wrapperRef.current.getBoundingClientRect()

        // If no dimensions or data is provided, the function will stop
        if (!dimensions || !stackedBarGraphData.length) return


        const stackGenerator = stack().keys(keys)
        const layers = stackGenerator(stackedBarGraphData)
        const yAxisRange = [0, 100]

        // Scales
        // This helps divide the width of the individual stacks evenly across the width of the svg
        const xScale = scaleBand()
            .domain(stackedBarGraphData.map(data => {
                console.log(data) 
                return data.space}))
            .range([0, width])
            .padding(0.25)
        
        // This divides the y values even along the height of the svg
        // Range goes from height to 0 because 0 is the top left of the svg, 
        // and height goes downwards
        const yScale = scaleLinear()
            .domain(yAxisRange)
            .range([height, 0])
        

        // Setting up the axes
        const xAxis = axisBottom(xScale)
        svg
            .select(".x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)

        const yAxis = axisLeft(yScale)
        svg
            .select(".y-axis")
            .call(yAxis)


        // Rendering the graph
        // Each layer holds the data points being graphed
        // Each rect holds a specific data point within that layer
        svg
            .selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", layer => colors[layer.key])
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")
            .attr("class", "dataRect")
            .transition()
            .duration(1500)
            .attr("x", sequence => xScale(sequence.data.space))
            .attr("width", xScale.bandwidth())
            .attr("y", sequence => yScale(sequence[1]))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))


    }, [stackedBarGraphData, dimensions, keys, colors])

    return (
    <article>
        <article className="graph stackedGraph">
            <div ref={wrapperRef}>
                <svg ref={stackedGraphRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
            
        </article>
    </article>
    )
}

export default StackedBarGraph