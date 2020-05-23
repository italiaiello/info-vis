import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import BarGraph from './components/BarGraph/BarGraph'
import GeoChart from './components/GeoChart/GeoChart'
import dataForUS from './json/states.geo.json'
import AnimatedStackedBarGraph from './components/StackedBarGraph/AnimatedStackedBarGraph'
import FilterButtons from './components/StackedBarGraph/FilterButtons'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'
import LineGraph from './components/LineGraph/LineGraph'
import StickyNavBar from './components/StickyNavBar'

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
    fatalities:"#803A29", 
    injured:"#FFB19E"
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
        <h2>Mass Shootings in the U.S. <br /><span id="subheading">as shown per state</span></h2> 
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

      <aside>
          <div class="aside-container">
            <h4>Jump To...</h4>
            <ol>
                <li><a href="#part1">Transcripts</a></li>
                <li><a href="#part1-2">Online Ethnography</a></li>
                <li><a href="#part1-3">Walkthrough Map</a></li>
                <li><a href="#affinity">Affinity Diagram</a></li>
            </ol>
          </div>
      </aside>

      <p className="bodyText">Based on a dataset of mass shootings in the United States of America (USA), we look 
        into a wide range of mass shootings that occurred from the 1st of July in 1966 to the 
        5th of November 2017, covering 323 shootings which resulted in a total of 1433 deaths 
        and 1995 injuries.</p>

      <h2 className="bodyHeading">Where do shootings occur most often?</h2>
      
      <p className="bodyText">The USA is a large country, consisting of 50 states. But does the location of the 
        shooting make any difference?

          <br />
          <br />

        As seen in the map above, California has the most significant number of mass shootings 
        compared to the other states, as well as the highest number of fatalities due to mass 
        shootings.

          <br />
          <br />

        While Nevada has had the highest number of injuries as a result of mass shootings during 
        this time period, it was the result of a single mass shooting, infamously known as the 
        “2017 Las Vegas shooting”, where a man named Stephen Paddock opened fire on a crowd of 
        concert goers at the Route 91 Harvest music festival on the Las Vegas strip in Nevada.

          <br />
          <br />

        As seen with California and Nevada, a higher number of mass shootings does not necessarily 
        result in a higher rate of injury or fatalities. Additionally, the severity of a mass 
        shooting is heavily dependent on multiple factors, such as the shooter's target if any, 
        their motives, and the time and place of the shooting, which may affect the number of 
        potential victims.

          <br />
          <br />

        Interestingly enough, there were three states with no recordings of mass shootings 
        throughout the past five decades, namely New Hampshire, North Dakota, and Rhode Island. 
        Perhaps either they were not captured in the data set, or there truly were no mass shootings, 
        making these three states arguably the safest regarding mass shootings.</p>
      
      
      <br />
      <br />
      <h2 className="bodyHeading">Percentage of fatalities and injuries as a result of mass shootings in open or 
        closed spaces</h2>
      <StackedBarGraph  stackedBarGraphData={spaceData} 
                        keys={spaceKeys}
                        colors={spaceColors}
      />
      <p className="bodyText">
        When comparing the locations where mass shootings took place, significantly more mass 
        shootings occurred in a closed space, over twice as many mass shootings than in open 
        spaces. Even when comparing the percentage of injuries to deaths per closed or open 
        space, there is a similarly significant increase in the percentage of overall fatalities
        from mass shootings in a closed space versus open space, as seen above.

        <br />
        <br />

        We can speculate that when in a closed space, the shooter is more likely to be in closer 
        proximity to the targets, which increases their chance of fatally wounding the victims, 
        leading to a higher fatality rate.
      </p>

      <br />
      <br />

      <h2 className="bodyHeading">Who is being targeted?</h2>
      <p className="bodyText">According to the data, nearly half of all recorded mass shootings in America from 1966 
        to 2017 either did not involve a specific target, or the shooters’ motives for targeting 
        these individuals is unclear.

        As seen in the map above, there are a significant number of mass shootings related to 
        family members, students, teachers, co-workers, and ex-partners, showing that in some 
        cases, when a shooter has a specific target, it tends to be someone they were close to.

        It could be surmised that because the shooter spends time with people they are close to, 
        that there are presumably more chances for conflicts to occur between both parties.
      </p>

      <article className="pieChartLayout">
        <div className="pieChartDesc">
          <h2>Some kind of heading</h2>
          <p>Looking at this from a different perspective, we compared the number of mass 
            shootings where shooters open fired randomly at a crowd, versus having a specific 
            target in mind when conducting the shooting.

            <br />
            <br />

            The pie chart shows a noteworthy increase in specific targets compared to random 
            shootings. As we continue to look deeper into a shooter’s motives, we can see that 
            there are many shooters who wish to vent their frustrations on specific targets, 
            likely to be the people who upset the shooter in the first place.</p>
        </div>
        <PieChart chartAlign={"alignRight"} pieChartData={pieChartData} innerRadius={0} outerRadius={150} />
      </article>

      <br/>
      <br/>

      <h2>Tom's Graphs</h2>
      <h3>Number of Shootings Per Year</h3>
      <LineGraph  lineGraphData={numShootingsData} 
                  yAxisMax={30} 
                  reverseData={false}
                  xAxisFontSize={10}
      />

      <br />
      <br />

      <article className="pieChartLayout">
        <PieChart chartClass={"alignPieRight"} pieChartData={occupationsData} innerRadius={100} outerRadius={150} />
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
            <option value="mentalHealth">motives of individuals suffering from mental health conditions</option>
            <option value="ageGroups">age groups</option>
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
      <br />

      <h2>Causes/motives for mass shootings</h2>
      <BarGraph barClassName={"motives"} barGraphData={barGraphData} />

      <br/>
      <br/>

      <h2>Nick's Graphs</h2>
      <article className="pieChartLayout">
        <div className="pieChartDesc">
          <h2>How many shooters had a mental health issue?</h2>
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

      <h3>Number of Shootings On a Given Day</h3>
      <LineGraph  lineGraphData={shootingsOnDayData} 
                  yAxisMax={4.5} 
                  reverseData={true} 
                  xAxisFontSize={5}
      />

      <br/>
      <br/>

    </section>
  )
}

export default App;
