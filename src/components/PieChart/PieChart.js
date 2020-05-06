import React, { useRef, useEffect } from 'react';
import { select, arc, pie } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

const LineGraph = ({ pieChartData, setLineGraphData }) => {

    const pieChartRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
        const svg = select(pieChartRef.current)

        if (!dimensions) return
        
        const arcGenerator = arc()
            .innerRadius(0)
            .outerRadius(150)

        const pieGenerator = pie()
        console.log(pieChartData)
        console.log(pieGenerator(pieChartData))

        svg
            .selectAll(".slice")
            .data(pieChartData)
            .join("path")
            .attr("class", "slice")
            .attr("d")

    }, [pieChartData, dimensions])

    return (
    <article className="graph pieChart">
        <div ref={wrapperRef}>
            <svg ref={pieChartRef}></svg>
        </div>
        
    </article>
    )
}

export default LineGraph