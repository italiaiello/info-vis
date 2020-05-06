import React, { Component } from 'react'
import * as d3 from "d3"


// https://swizec.com/blog/how-to-make-a-piechart-using-react-and-d3/swizec/6785

import Arc from './Arc';
 
export default class Piechart extends Component {
    constructor() {
        super()

        this.pie = d3.pie().value(d => d.value)

        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    }
    
    // Generates the individual arcs for each piece of data
    arcGenerator(d, i) {
        return (
            <Arc key={`arc-${i}`}
                        data={d}
                        innerRadius={this.props.innerRadius}
                        outerRadius={this.props.outerRadius}
                        color={this.colors(i)} />
        );
    }
 
    render() {
        const { data } = this.props;
        // This will hold the pie chart data and position the chart at the
        // coordinates provided
        let pieChart = this.pie(data),
            translate = `translate(${this.props.x}, ${this.props.y})`;
        
        // Then we use the arcGenerator function to create the arc for each 
        // piece of data which will eventuate in an completed pie chart
        return (
            <article>
                <svg className="pieChartSVG">
                <g transform={translate}>
                    {pieChart.map((d, i) => this.arcGenerator(d, i))}
                </g>
                </svg>
            </article>
        )
    }
}