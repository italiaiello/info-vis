import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import BarGraph from './components/BarGraph/BarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import dataForUS from './json/states.geo.json'
import AnimatedStackedBarGraph from './components/StackedBarGraph/AnimatedStackedBarGraph'
import FilterButtons from './components/StackedBarGraph/FilterButtons'
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
import targetsFrequency from './data/DC/targetsFrequency.csv'
import closeOpenSpaces from './data/DC/closeOpenSpaces.csv'

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
          filterMilitaryCulprits,
          filterMentalHealthData } from './functions/filterAndrewData'

import { filterVictimsData, filterTargetsData, parseClosedOpenData } from './functions/filterDCData'

import { formatData } from './functions/formatData'

import './App.css';

function App() {
  
  // GeoChart Data
  // const [shootingsPerState, setShootingsPerState] = useState({})
  const [victimsPerState, setVictimsPerState] = useState({})
  const [targetsPerState, setTargetsPerState] = useState({})
  const [property, setProperty] = useState("shootings")
  const [isTargetsOptionSelected, setIsTargetsOptionSelected] = useState(false)
  // This holds the index of which target has been selected
  // This index will help us retrieve the number of victims associated with that target
  // for a specific state
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(0)


  // For first dropdown
  const onStatChange = (e) => {
    if (e.target.value !== "target") {
      setProperty(e.target.value)
      setIsTargetsOptionSelected(false)
    } else {
      setProperty(e.target.value)
      setIsTargetsOptionSelected(true)
    }
  }

  // For the second dropdown that appears when 'Targets' is selected
  const onTargetChange = (e) => {
    const index = document.getElementById("targetSelect").selectedIndex
    setProperty(e.target.value)
    setSelectedTargetIndex(index)
  }


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



  // First Animated Stacked Bar Graph data
  const [ageGroupData, setAgeGroupData] = useState({})
  const ageGroupKeys = ['kidsAndTeenagers', 'youngAdults', 'adults', 'middleAged']
  const [ageGroups, setAgeGroups] = useState(ageGroupKeys)
  const ageGroupColors = {
    kidsAndTeenagers:"#BB86FC", 
    youngAdults:"#FF867D", 
    adults: "#7CFDA3", 
    middleAged: "#FFF57D"
  }

  // Second Animated Stacked Bar Graph data
  const [mentalHealthFrequencies, setMentalHealthFrequencies] = useState([])
  const mentalHealthKeys = ["actsOfTerrorism", "psychologicalFactors", "anger", "frustration", "unknown"]
  const [mentalIllnesses, setMentalIllnesses] = useState(mentalHealthKeys)
  const mentalHealthColors = {
    actsOfTerrorism:"#BB86FC", 
    psychologicalFactors:"#FF867D", 
    anger: "#7CFDA3", 
    frustration: "#E14C92",
    unknown: "#FFAA57"
  }

  // Function for filtering data for both stacked bar graphs
  const onCheckboxChange = (e, key, keysArray, setKeysArray) => {
    if (!e.target.checked) {
        const filteredKeysArray = keysArray.filter(currentKey => currentKey !== key)
        setKeysArray(filteredKeysArray)
    } else {
        setKeysArray(Array.from(new Set([...keysArray, key])))
    }
  }

  const [stackedDataToView, setStackedDataToView] = useState("")

  const onDataChange = (e) => {
    console.log(e.target.value)
    setStackedDataToView(e.target.value)
  }



  // Stacked Bar Graph Data
  const [spaceData, setSpaceData] = useState([])
  const spaceKeys = ["fatalities", "injured"]
  const spaceColors = {
    fatalities:"#DA0000", 
    injured:"#DAAC00"
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
      setAgeGroupData(dataReceived)
    })

    // Filtering data for pie chart about the targets for mass shootings
    csv(allMassShootings).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataForPieChart = filterShootingTargetData(data)
      setPieChartData(dataForPieChart)

      const dataForStackedGraph = filterMentalHealthData(data)
      setMentalHealthFrequencies(dataForStackedGraph)

    })

    csv(shooterOccupations).then(data => {
      // Created a method (see functions folder) that extracts the data required
      const dataReceived = filterMilitaryCulprits(data)
      setOccupationsData(dataReceived)
    })

    // Filtering data for geo chart
    csv(victimsOfShootings).then(data => {
      const dataReceived = filterVictimsData(data)
      setVictimsPerState(dataReceived)
    })

    csv(targetsFrequency).then(data => {
      const dataReceived = filterTargetsData(data)

      setTargetsPerState(dataReceived)
    })

    // Filtering data for bar graph about mental health
    csv(mentalHealthIssues).then(data => {
      const dataReceived = formatData(data, "Cause", "NumShooters")
      setMentalHealthData(dataReceived)
    })

    // Filtering data for bar graph about mental health
    csv(noMentalIssues).then(data => {
      const dataReceived = formatData(data, "Cause", "NumShooters")
      setMentalIllnessAbsentData(dataReceived)
    })

    // Filtering data for line graph about number of shootings
    csv(numMassShootings).then(data => {
      const dataReceived = formatData(data, "Date", "NumShootings")
      setNumShootingsData(dataReceived)
    })

    // Filtering data for line graph about number of shootings
    csv(numShootingsOnADay).then(data => {
      const dataReceived = formatData(data, "Date", "NumShootings")
      setShootingsOnDayData(dataReceived)
    })

    // Filtering data for stacked bar graph about closed and open spaces
    csv(closeOpenSpaces).then(data => {
      const dataReceived = parseClosedOpenData(data)
      setSpaceData(dataReceived)
    })


  }, [])

  return (
    <section className="graphs">
      <article className="geoChartContainer">
        <h2>Mass Shootings in the U.S. <br /><span id="subheading">as shown per state</span>  </h2> 
        <h3>Hover over or click a state for more info</h3>
        <GeoChart data={dataForUS}
                  victimsPerState={victimsPerState}
                  targetsPerState={targetsPerState}
                  property={property}
                  isTargetsOptionSelected={isTargetsOptionSelected}
                  selectedTargetIndex={selectedTargetIndex}
        />
        <article className="dropdownContainer">
          <span className={isTargetsOptionSelected ? "show" : "hide"}>had</span>
          {
            isTargetsOptionSelected &&
            <select id="targetSelect" className="dropdown" onChange={onTargetChange}>
                  {
                      // We need to create a dropdown with all the targets.
                      // Every state has the targets defined, so we can just choose a state
                      // and grab all the targets from there
                      targetsPerState["Alabama"].map((currentTarget, index) => {
                          let targetString = currentTarget.target.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                          targetString = `${targetString.charAt(0).toUpperCase()}${targetString.substring(1)}`

                          return <option onClick={console.log(index)} 
                                          key={index} 
                                          value={currentTarget.target} 
                                          data-index={index}
                                  >
                                  {targetString}
                                  </option>
                      })
                  }
            </select>
          }
          <span className={isTargetsOptionSelected ? "show" : "hide"}>as a</span>
          <select className="dropdown" onChange={onStatChange} >
            <option value="shootings">Shootings</option>
            <option value="target">Target</option>
            <option value="fatalities">Fatalities</option>
            <option value="injuries">Injuries</option>
            <option value="policemenKilled">Policemen Killed</option>
            <option value="totalVictims">Total Victims</option>
          </select>
          
        </article>
        <br/>
        <br/>
      </article>
      
      <br />
      <br />
      <article className="pieChartLayout">
        <div className="pieChartDesc">
          <h2>Some kind of heading</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies congue nunc eget imperdiet. Cras ac purus nisi. Aliquam erat volutpat. Ut quis purus dapibus, imperdiet arcu ut, porttitor diam. In hac habitasse platea dictumst. In suscipit metus sit amet orci tempus lobortis semper non ex. Aliquam euismod, elit at sollicitudin tincidunt, metus justo ultrices dolor, quis gravida mi felis non neque. Quisque ac ligula nec ligula commodo hendrerit ut eu lacus.

            Donec quis metus orci. Nullam sapien orci, tempus eget velit nec, semper egestas augue. Fusce vitae odio tellus. Vivamus vulputate interdum nisi, dapibus convallis turpis tincidunt nec. Aliquam scelerisque tortor vel dignissim fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed et risus ut est consequat fermentum.</p>
        </div>
        <PieChart pieChartData={pieChartData} innerRadius={0} outerRadius={150} />
      </article>
      <br />
      <br />
      <article className="pieChartLayout">
        <PieChart pieChartData={occupationsData} innerRadius={100} outerRadius={150} />
        <div className="pieChartDesc">
          <h2>Some kind of heading</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies congue nunc eget imperdiet. Cras ac purus nisi. Aliquam erat volutpat. Ut quis purus dapibus, imperdiet arcu ut, porttitor diam. In hac habitasse platea dictumst. In suscipit metus sit amet orci tempus lobortis semper non ex. Aliquam euismod, elit at sollicitudin tincidunt, metus justo ultrices dolor, quis gravida mi felis non neque. Quisque ac ligula nec ligula commodo hendrerit ut eu lacus.

            Donec quis metus orci. Nullam sapien orci, tempus eget velit nec, semper egestas augue. Fusce vitae odio tellus. Vivamus vulputate interdum nisi, dapibus convallis turpis tincidunt nec. Aliquam scelerisque tortor vel dignissim fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed et risus ut est consequat fermentum.</p>
        </div>
      </article>
      <br />
      <br />
      <article className="stackedGraphSection">
        <div className="stackedGraphHeading">
          <h2>Number of U.S. Mass Shootings per year in relation to</h2>
          <select className="dropdown" onChange={onDataChange}>
            <option value="mentalHealth">Mental Health</option>
            <option value="ageGroups">Age Groups</option>
          </select>
        </div>
        {
          stackedDataToView === "ageGroups"
          ?
          <div>
            <FilterButtons keysState={ageGroups} 
                            keysArray={ageGroupKeys} 
                            colors={ageGroupColors} 
                            setKeysArray={setAgeGroups} 
                            onCheckboxChange={onCheckboxChange} 
            />
            <AnimatedStackedBarGraph  stackedBarGraphData={ageGroupData} 
                                    keys={ageGroups}
                                    colors={ageGroupColors}
            />
          </div>
          :
          <div>
            <FilterButtons keysState={mentalIllnesses} 
                            keysArray={mentalHealthKeys} 
                            colors={mentalHealthColors} 
                            setKeysArray={setMentalIllnesses} 
                            onCheckboxChange={onCheckboxChange} 
            />
            <AnimatedStackedBarGraph  stackedBarGraphData={mentalHealthFrequencies} 
                                      keys={mentalIllnesses}
                                      colors={mentalHealthColors}
            />
          </div>
        }
      </article>
      <br />
      <br />
      <StackedBarGraph  stackedBarGraphData={spaceData} 
                        keys={spaceKeys}
                        colors={spaceColors}
      />
      <br />
      <h2>Causes/motives for mass shootings</h2>
      <BarGraph barClassName={"motives"} barGraphData={barGraphData} />
      <br/>
      <br/>
      <h2>Nick's Graphs</h2>
      
      <article className="pieChartLayout">
        <div className="pieChartDesc">
          <h3>How many shooters had a mental health issue?</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies congue nunc eget imperdiet. Cras ac purus nisi. Aliquam erat volutpat. Ut quis purus dapibus, imperdiet arcu ut, porttitor diam. In hac habitasse platea dictumst. In suscipit metus sit amet orci tempus lobortis semper non ex. Aliquam euismod, elit at sollicitudin tincidunt, metus justo ultrices dolor, quis gravida mi felis non neque. Quisque ac ligula nec ligula commodo hendrerit ut eu lacus.

              Donec quis metus orci. Nullam sapien orci, tempus eget velit nec, semper egestas augue. Fusce vitae odio tellus. Vivamus vulputate interdum nisi, dapibus convallis turpis tincidunt nec. Aliquam scelerisque tortor vel dignissim fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed et risus ut est consequat fermentum.</p>
        </div>
        <PieChart pieChartData={{ yes: 106, no: 93, unknown: 124 }} innerRadius={0} outerRadius={150} />
      </article>
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
