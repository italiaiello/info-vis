import React, {useRef, useEffect, useState} from 'react';
import { 
  select, 
  line, 
  curveCardinal, 
  axisBottom, 
  axisRight,
  scaleLinear } from 'd3';

import AnimatedBarGraph from './components/AnimatedBarGraph/AnimatedBarGraph'

import './App.css';

function App() {

  const [data, setData] = useState([20, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef()

  // will be called initially and then every time the data array changes
  useEffect(() => {
    const svg = select(svgRef.current)
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300])

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0])

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis)

    const yAxis = axisRight(yScale)
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
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
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")

  }, [data])

  return (
    <section className="graphs">
      <article className="graph lineGraph">
        <svg ref={svgRef}>
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
      <br />
      <AnimatedBarGraph />
    </section>
  );
}

export default App;
