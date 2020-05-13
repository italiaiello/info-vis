import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import BarGraph from './components/BarGraph/BarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import dataForUS from './json/states.geo.json'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'
import LineGraph from './components/LineGraph/LineGraph'

// Converts csv files to an array so we can manipulate them
import { csv } from 'd3'
// Andrew's Data
import allMassShootings from './data/Andrew/mass_shootings.csv'
import massShootingCauses from './data/Andrew/causeForHighFatalities.csv'
import culpritDemographics from './data/Andrew/culpritDemographics.csv'
import shooterOccupations from './data/Andrew/militaryShooters.csv'

// DC's Data
import victimsOfShootings from './data/DC/victimsPerState.csv'

// Nick's Data
import mentalHealthIssues from './data/Nick/mentalHealthIssues.csv'
import noMentalIssues from './data/Nick/noMentalHealthIssues.csv'

// Tom's Data
import numMassShootings from './data/Tom/numMassShootings.csv'
import numShootingsOnADay from './data/Tom/numShootingsOnADay.csv'

// All filter and update functions (from the andrewsFunctions.js file)
// If you make a separate, make a new import, don't append it to this one as
// it won't find it in the andrewsFunctions.js file
import {  filterCasualtyData, 
          filterCulpritDemographicData, 
          filterShootingTargetData, 
          filterMilitaryCulprits } from './functions/filterAndrewData'

import { filterVictimsData } from './functions/filterDCData'

import { formatData } from './functions/formatData'

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
  const [mentalHealthData, setMentalHealthData] = useState({})
  const [mentalIllnessAbsentData, setMentalIllnessAbsentData] = useState({})

  // Line graph data
  const [numShootingsData, setNumShootingsData] = useState({})
  const [shootingsOnDayData, setShootingsOnDayData] = useState({})

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

    csv(mentalHealthIssues).then(data => {
      const dataReceived = formatData(data, "Cause", "NumShooters")
      setMentalHealthData(dataReceived)
    })

    csv(noMentalIssues).then(data => {
      const dataReceived = formatData(data, "Cause", "NumShooters")
      setMentalIllnessAbsentData(dataReceived)
    })

    csv(numMassShootings).then(data => {
      const dataReceived = formatData(data, "Date", "NumShootings")
      setNumShootingsData(dataReceived)
    })

    csv(numShootingsOnADay).then(data => {
      const dataReceived = formatData(data, "Date", "NumShootings")
      setShootingsOnDayData(dataReceived)
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
        <option value="shootings" label="Shootings">Shootings</option>
        <option value="fatalities" label="Fatalities">Fatalities</option>
        <option value="injuries" label="Injuries">Injuries</option>
        <option value="policemenKilled" label="Policemen Killed">Policemen Killed</option>
        <option value="totalVictims" label="Total Victims">Total Victims</option>
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
      <BarGraph barClassName={"motives"} barGraphData={barGraphData} />
      <br/>
      <br/>
      <h2>Nick's Graphs</h2>
      <h3>How many shooters had a mental health issue</h3>

      <PieChart pieChartData={{ yes: 106, no: 93, unknown: 124 }} innerRadius={0} outerRadius={150} />
      <br/>
      <br/>
      <BarGraph barClassName={"mhIssue"} barGraphData={mentalHealthData} />
      <br/>
      <br/>
      <BarGraph barClassName={"noMHIssue"} barGraphData={mentalIllnessAbsentData} />
      <br/>
      <br/>
      <h2>Tom's Graphs</h2>
      <h3>Number of Shootings Per Year</h3>
      <LineGraph  lineGraphData={numShootingsData} 
                  yAxisMax={30} 
                  reverseData={false}
                  xAxisFontSize={10}
      />
      <br/>
      <br/>
      <h3>Number of Shootings On a Given Day</h3>
      <LineGraph  lineGraphData={shootingsOnDayData} 
                  yAxisMax={4.5} 
                  reverseData={true} 
                  xAxisFontSize={5}
      />
      <br/>
      <br/>
      <br/>
      <br/>
    </section>
  )
}

export default App;
