import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import LineGraph from './components/LineGraph/LineGraph'
import AnimatedBarGraph from './components/BarGraph/BarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import data from './json/worldMap.geo.json'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'

import { csv } from 'd3'
import allMassShootings from './data/Andrew/mass_shootings.csv'
import massShootingCauses from './data/Andrew/causeForHighFatalities.csv'
import culpritDemographics from './data/Andrew/culpritDemographics.csv'
import shooterOccupations from './data/Andrew/militaryShooters.csv' 

import { filterCasualtyData, filterCulpritDemographicData, filterShootingTargetData, filterMilitaryCulprits } from './functions/andrewsFunctions'


import './App.css';

function App() {

  // Line graph data
  const [lineGraphData, setLineGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // GeoChart state
  const [property, setProperty] = useState("pop_est")

  // PieChart Data
  const [pieChartData, setPieChartData] = useState({})
  const [occupationsData, setOccupationsData] = useState({})

  // Bar graph data
  const [barGraphData, setBarGraphData] = useState({})

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
    // Filtering the data and preparing it for the bar graph about causes/motives
    csv(massShootingCauses).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterCasualtyData(data)
      setBarGraphData(dataReceived)
    })

    // Filtering the data for stacked bar chart about shootings per ages each year
    csv(culpritDemographics).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterCulpritDemographicData(data)
      setCulpritData(dataReceived)
    })

    // Filtering data for pie chart about the targets for mass shootings
    csv(allMassShootings).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterShootingTargetData(data)
      setPieChartData(dataReceived)
    })

    csv(shooterOccupations).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterMilitaryCulprits(data)
      setOccupationsData(dataReceived)
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
      <br />
      <article>
        <h2>Occupations of Shooters</h2>
        <PieChart pieChartData={occupationsData} innerRadius={100} outerRadius={150} />
      </article>
      <br />
      <br />
      <h2>Number of U.S. Mass Shootings per year for each age group </h2>
      <h3>{"Kids and Teenagers (red), Young Adults (yellow), Adults (green), Middle-Aged (blue)"}</h3>
      <StackedBarGraph  stackedBarGraphData={culpritData} 
                        keys={culpritKeys}
                        colors={culpritColors}
      />
      <br />
      <br />
      <br />
      <h2>Causes/motives for mass shootings</h2>
      <AnimatedBarGraph barGraphData={barGraphData} />
      <br/>
      <br/>
      <LineGraph lineGraphData={lineGraphData} setLineGraphData={setLineGraphData} />
      <br/>
      <br/>
    </section>
  )
}

export default App;
