import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import BarGraph from './components/BarGraph/BarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import dataForUS from './json/states.geo.json'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'

import { csv } from 'd3'
// Import your data here so that all the data is one place
// The name in blue can be whatever you like
import allMassShootings from './data/Andrew/mass_shootings.csv'
import massShootingCauses from './data/Andrew/causeForHighFatalities.csv'
import culpritDemographics from './data/Andrew/culpritDemographics.csv'
import shooterOccupations from './data/Andrew/militaryShooters.csv'

// DC's Data
import victimsOfShootings from './data/DC/victimsPerState.csv'

// All filter and update functions (from the andrewsFunctions.js file)
// If you make a separate, make a new import, don't append it to this one as
// it won't find it in the andrewsFunctions.js file
import {  filterCasualtyData, 
          filterCulpritDemographicData, 
          filterShootingTargetData, 
          filterMilitaryCulprits } from './functions/filterAndrewData'

import { filterVictimsData } from './functions/filterDCData'

import './App.css';

function App() {
  
  // GeoChart Data
  // const [shootingsPerState, setShootingsPerState] = useState({})
  const [victimsPerState, setVictimsPerState] = useState([])
  const [property, setProperty] = useState("shootings")

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
      const dataForPieChart = filterShootingTargetData(data)
      setPieChartData(dataForPieChart)

    })

    csv(shooterOccupations).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterMilitaryCulprits(data)
      setOccupationsData(dataReceived)
    })

    csv(victimsOfShootings).then(data => {
      const dataReceived = filterVictimsData(data)
      setVictimsPerState(dataReceived)
    })

  }, [])

  return (
    <section className="graphs">
      <h2>Number of Mass Shootings in the U.S. Per State  </h2> 
      <GeoChart data={dataForUS} 
                // shootingsPerState={shootingsPerState}
                victimsPerState={victimsPerState}
                property={property} 
      />
      <br />
      <br />
      <select className="dropdown" onChange={(e) => setProperty(e.target.value)}>
        <option value="shootings">Shootings</option>
        <option value="fatalities">Fatalities</option>
        <option value="injuries">Injuries</option>
        <option value="policemenKilled">Policemen Killed</option>
        <option value="totalVictims">Total Victims</option>
      </select>
      <br />
      <br />
                {/* Data goes here 
                 The name in brackets should be what you named your data 
                 This one is called pieChartData because I had to filter my 
                 data first */}
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
                        {/* Add data here */}
      <StackedBarGraph  stackedBarGraphData={culpritData} 
                        // Make a variable with all the keys as shown below
                        // Or write them in like this:
                        // keys={["key1", "key2", "key3" ... etc]}
                        keys={culpritKeys}
                        // Same thing as above
                        colors={culpritColors}
      />
      <br />
      <br />
      <br />
      <h2>Causes/motives for mass shootings</h2>
                 {/* Add data here */}
      <BarGraph barGraphData={barGraphData} />
      <br/>
      <br/>
    </section>
  )
}

export default App;
