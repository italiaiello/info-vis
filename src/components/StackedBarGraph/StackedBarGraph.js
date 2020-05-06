import React, { useRef, useEffect } from 'react';
import { select } from 'd3';

import { useResizeObserver } from '../../hooks/useResizeObserver'

// https://www.youtube.com/watch?v=bXN9anQN_kQ&list=PLDZ4p-ENjbiPo4WH7KdHjh_EMI7Ic8b2B&index=16

const PieChart = ({ stackedGraphData }) => {

    // Pointers for the svg and wrapping article element respectively
    const stackedGraphRef = useRef()
    const wrapperRef = useRef()

    // Allows us to make the chart a bit more responsive
    const dimensions = useResizeObserver(wrapperRef)

    // will be called initially and then every time the data array changes
    useEffect(() => {
        const svg = select(stackedGraphRef.current)

        // If no dimensions or data is provided, the function will exit
        if (!dimensions) return

    }, [stackedGraphData, dimensions])

    return (
    <article className="graph pieChart">
        <div ref={wrapperRef}>
            <svg ref={stackedGraphRef}></svg>
        </div>
        
    </article>
    )
}

export default PieChart