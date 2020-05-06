import React, { Component } from 'react';
import * as d3 from 'd3'
 
class Arc extends Component {
    constructor() {
        super();
        this.arc = d3.arc();
    }
    
    // 
    componentWillMount() {
        this.updateD3(this.props);
    }
    
    // Grabs the properties that were passed to it from PieChart.js
    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }
    
    // Setting the radius from what was inputted into the PieChart component
    // in the App.js file
    updateD3(newProps) {
        this.arc.innerRadius(newProps.innerRadius);
        this.arc.outerRadius(newProps.outerRadius);
    }
    
    // Creates the arc for the piece of data passed to it
    render() {
        return (
            <path d={this.arc(this.props.data)}
                  style={{fill: this.props.color}}></path>
        );
    }
}

export default Arc;

// This class creates an arc with a text label, but it might be better 
// to have a legend as the text gets all mangled

// class LabeledArc extends Arc {
//     render() {
//         let [labelX, labelY] = this.arc.centroid(this.props.data),
//             labelTranslate = `translate(${labelX}, ${labelY})`;
 
//         return (
//             <g>
//                 {super.render()}
//                 <text transform={labelTranslate}
//                       textAnchor="middle">
//                     {this.props.data.data.label}
//                 </text>
//             </g>
//         );
//     }
// }
 

 