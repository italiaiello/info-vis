import React, { useState, useEffect } from 'react';
import LineGraph from './components/LineGraph/LineGraph'
import AnimatedBarGraph from './components/AnimatedBarGraph/AnimatedBarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import data from './json/worldMap.geo.json'

import { csv } from 'd3'
import csvData from './data/causeForHighFatalities.csv'
import { filterCasualtyData } from './functions/filterCasualtyData'


import './App.css';

function App() {

  // Line graph data
  const [lineGraphData, setLineGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // Bar graph data
  const [barGraphData, setBarGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // GeoChart state
  const [property, setProperty] = useState("pop_est")

  // PieChart Data
  const [pieChartData, setPieChartData] = useState([])

  useEffect(() => {
    // Filtering the data and preparing it for the pie chart
    csv(csvData).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataArray = filterCasualtyData(data)
      setPieChartData(dataArray)
    })
  }, [])

  return (
    <section className="graphs">
      <h2>World Map with d3-geo</h2>
      <GeoChart data={data} property={property} />
      <h2>Select property to highlight</h2>
      <select
          value={property}
          onChange={event => setProperty(event.target.value)}
      >
          <option value="pop_est">Population</option>
          <option value="name_len">Name length</option>
          <option value="gdp_md_est">GDP</option>
      </select>
      <br />
      <LineGraph lineGraphData={lineGraphData} setLineGraphData={setLineGraphData} />
      <br />
      <AnimatedBarGraph barGraphData={barGraphData} setBarGraphData={setBarGraphData} />
    </section>
  )
}

export default App;
