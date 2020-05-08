import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import LineGraph from './components/LineGraph/LineGraph'
import AnimatedBarGraph from './components/AnimatedBarGraph/AnimatedBarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import data from './json/worldMap.geo.json'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'

import { csv } from 'd3'
import massShootingCauses from './data/causeForHighFatalities.csv'
import culpritDemographics from './data/culpritDemographics.csv'

import { filterCasualtyData, filterCulpritDemographicData } from './functions/dataWrangling'


import './App.css';

function App() {

  // Line graph data
  const [lineGraphData, setLineGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // Bar graph data
  const [barGraphData, setBarGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // GeoChart state
  const [property, setProperty] = useState("pop_est")

  // PieChart Data
  const [pieChartData, setPieChartData] = useState({})

  // Culprit Data for Stacked Bar Graph
  const [culpritData, setCulpritData] = useState({})
  // Data points we want to show in the stacked bar chart
  const culpritKeys = ['kidsAndTeenagers', 'youngAdults', 'adults', 'middleAged']
  // Colors of each data point, which would colorise the stack of each year
  const culpritColors = {
    kidsAndTeenagers:"#f75a52", 
    youngAdults:"#f7bc52", 
    adults: "#40c04f", 
    middleAged: "#4165a4"
  }


  useEffect(() => {
    // Filtering the data and preparing it for the pie chart
    csv(massShootingCauses).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterCasualtyData(data)
      setPieChartData(dataReceived)
    })

    csv(culpritDemographics).then(data => {
      const dataReceived = filterCulpritDemographicData(data)
      setCulpritData(dataReceived)
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
      <br />
      <PieChart pieChartData={pieChartData} innerRadius={0} outerRadius={150} />
      <br />
      <StackedBarGraph  stackedBarGraphData={culpritData} 
                        keys={culpritKeys}
                        colors={culpritColors}
      />
      <br />
      <br />
      <LineGraph lineGraphData={lineGraphData} setLineGraphData={setLineGraphData} />
      <br />
      <AnimatedBarGraph barGraphData={barGraphData} setBarGraphData={setBarGraphData} />
    </section>
  )
}

export default App;
