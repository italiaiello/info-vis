import React, { useState, useEffect } from 'react';

import PieChart from './components/PieChart/PieChart'
import GeoChart from './components/GeoChart/GeoChart'
import dataForUS from './json/states.geo.json'
import AnimatedStackedBarGraph from './components/StackedBarGraph/AnimatedStackedBarGraph'
import FilterButtons from './components/StackedBarGraph/FilterButtons'
import StackedBarGraph from './components/StackedBarGraph/StackedBarGraph'
import LineGraph from './components/LineGraph/LineGraph'
import Sidebar from './components/Sidebar/Sidebar'

// Converts csv files to an array so we can manipulate them
import { csv } from 'd3'
// Andrew's Data
import allMassShootings from './data/Andrew/mass_shootings.csv'
import culpritDemographics from './data/Andrew/culpritDemographics.csv'
import shooterOccupations from './data/Andrew/militaryShooters.csv'

// DC's Data
import victimsOfShootings from './data/DC/victimsPerState.csv'
import targetsFrequency from './data/DC/targetsFrequency.csv'
import closeOpenSpaces from './data/DC/closeOpenSpaces.csv'

// Tom's Data
import numMassShootings from './data/Tom/numMassShootings.csv'

// All filter and update functions (from the andrewsFunctions.js file)
// If you make a separate, make a new import, don't append it to this one as
// it won't find it in the andrewsFunctions.js file
import {  filterCulpritDemographicData,
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
  const [target, setTarget] = useState("basketballPlayers")
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
    setTarget(e.target.value)
    setSelectedTargetIndex(index)
  }


  // PieChart Data
  const [pieChartData, setPieChartData] = useState({})
  const [occupationsData, setOccupationsData] = useState({})


  // Line graph data
  const [numShootingsData, setNumShootingsData] = useState({})



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
    fatalities:"#69201C",
    injured:"#E68C86"
  }


  useEffect(() => {

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

    // Filtering data for line graph about number of shootings
    csv(numMassShootings).then(data => {
      const dataReceived = formatData(data, "Date", "NumShootings")
      setNumShootingsData(dataReceived)
    })


    // Filtering data for stacked bar graph about closed and open spaces
    csv(closeOpenSpaces).then(data => {
      const dataReceived = parseClosedOpenData(data)
      setSpaceData(dataReceived)
    })


  }, [])

  return (
    <section className="graphs">
      <article id="part1" className="geoChartContainer">
        <GeoChart data={dataForUS}
                  victimsPerState={victimsPerState}
                  targetsPerState={targetsPerState}
                  property={property}
                  target={target}
                  isTargetsOptionSelected={isTargetsOptionSelected}
                  selectedTargetIndex={selectedTargetIndex}
        />

        <article className="dropdownContainer">
          <span className={isTargetsOptionSelected ? "show" : "hide"}>had</span>
          <form>
          {
            isTargetsOptionSelected &&
            <select value={target} id="targetSelect" className="dropdown" onChange={onTargetChange}>
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
          <select value={property} className="dropdown" onChange={onStatChange} >
            <option value="shootings">Shootings</option>
            <option value="target">Target</option>
            <option value="fatalities">Fatalities</option>
            <option value="injuries">Injuries</option>
            <option value="policemenKilled">Policemen Killed</option>
            <option value="totalVictims">Total Victims</option>
          </select>
          </form>
        </article>
        <p className="dataSource">Kaggle, 2017, Mass Shootings in the U.S. (per state).
          Obtained from Wikipedia, Mother Jones, Stanford, USA Today, and other web sources,
          last accessed 24 May 2020:
           <a className="dataLink"
                href="https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years"
                target="_blank"
                rel="noopener noreferrer"
            >
                https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years
            </a>
        </p>
        <br/>
        <br/>
        <h2>Mass Shootings in the U.S. <br /><span id="subheading">as shown per state</span></h2>
        {/* <h3>Hover over or click a state for more info</h3> */}
        <p className="hypothesis">Does the public accessibility of firearms and the complexity of mental health in the
          United States of America increase the likelihood of gun violence and mass shootings?</p>

      </article>

      <Sidebar />

      <p className="bodyText">Based on a dataset of mass shootings in the United States of America (USA), we look
        into a wide range of mass shootings that occurred from the 1st of July in 1966 to the
        5th of November 2017, covering 323 shootings which resulted in a total of 1433 deaths
        and 1995 injuries.</p>

      <h2 id="part2" className="bodyHeading">Where do shootings occur most often?</h2>

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

        Interestingly enough, there were three states with no recordings of mass shootings
        throughout the past five decades, namely New Hampshire, North Dakota, and Rhode Island.
        Perhaps either they were not captured in the data set, or there truly were no mass shootings,
        making these three states arguably the safest regarding mass shootings.</p>


      <br />
      <br />
      <h3 id="part2-1" className="bodyHeading">Percentage of fatalities and injuries as a result of mass shootings in open or
        closed spaces</h3>
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
      </p>

      <br />
      <br />

      <h2 id="part3" className="bodyHeading">Who is being targeted?</h2>
      <p className="bodyText">According to the data, nearly half of all recorded mass shootings in America from 1966
        to 2017 either did not involve a specific target, or the shooters’ motives for targeting
        these individuals is unclear.

        As seen in the map above, there are a significant number of mass shootings related to
        family members, students, teachers, co-workers, and ex-partners, showing that in some
        cases, when a shooter has a specific target, it tends to be someone they were close to.
      </p>

      <article className="pieChartLayout">
        <div className="pieChartDesc">
          <h3 id="part3-1">Shootings involving a specific vs random target</h3>
          <p>Looking at this from a different perspective, we compared the number of mass
            shootings where shooters open fire randomly at a crowd, versus having a specific
            target in mind when conducting the shooting.

            <br />
            <br />

            The pie chart shows a noteworthy increase in specific targets compared to random
            shootings. As we continue to look deeper into a shooter’s motives, we can see that
            there are many shooters who wish to vent their frustrations on specific targets,
            likely to be the people who upset the shooter in the first place.</p>
        </div>
        <PieChart chartId="firstChart" chartAlign={"alignRight"} pieChartData={pieChartData} innerRadius={0} outerRadius={150} />
      </article>

      <br/>
      <br/>

      <h2 id="part4" className="bodyHeading">Frequency of shootings</h2>
      <p className="bodyText">
      The date of mass shootings has also been considered, in order to learn what role it may have on mass shootings, if any.
      </p>
      <LineGraph  lineGraphData={numShootingsData}
                  yAxisMax={30}
                  reverseData={false}
                  xAxisFontSize={10}
      />
      <p className="dataSource">Kaggle, 2017, Mass Shootings in the U.S. (per state).
          Obtained from Wikipedia, Mother Jones, Stanford, USA Today, and other web sources,
          last accessed 24 May 2020:
           <a className="dataLink"
                href="https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years"
                target="_blank"
                rel="noopener noreferrer"
            >
                https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years
            </a>
        </p>

      <br />

      <p className="bodyText">Immediately upon observation, we may easily interpret the 2015-2016 period to be the
        most deadly years of mass shootings in the US. We can also determine that this is a
        prevalent spike in mass shootings during this period, as the number of these tragedies
        drops back to the same levels in 2007-2013 for the 2017 year.
        <br/>
        <br/>
        Thus, can we conclude that the prevalence of mass shootings increased over time? While
        we may be inclined to follow the data and provide a solid ‘yes’, we should also consider
        that since 1967, the way that mass shootings and the factors around society have changed
        and evolved greatly. According to this data, it is clear that mass shootings have increased
        over time, almost exponentially; but we may also need to consider that there are several
        factors that may have affected this data.

      </p>

      <br />
      <br />

      <h2 id="part5" className="bodyHeading">Why do they do it?</h2>
      <p className="bodyText">The data has provided various information about the shooter, such as their
        age, gender, possible mental health, their intended target, their motives,
        and more.</p>

      <article id="part5-1" className="pieChartLayout">
        <div className="pieChartDesc">
          <h3>Did the shooter suffer from a mental health issue?</h3>
          <p>We can see that 33% of assailants were diagnosed as mentally ill while 29% did
            not have any major mental health issues. It is important to note that 38% of
            recorded shooters mental health status was not identified. This could have been
            due to the information not being revealed, or the information being unavailable,
            such as when the shooter commits suicide.</p>
        </div>
        <PieChart chartId="secondChart" chartAlign={"alignRight"} pieChartData={{ yes: 106, no: 93, unknown: 124 }} innerRadius={0} outerRadius={150} />
      </article>

      <br />
      <br />

      <article className="stackedGraphSection animatedStackedGraph">
        <div className="stackedGraphHeading">
          <h2 id="part6">Number of U.S. Mass Shootings per year in relation to:</h2>
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

      <p id="stackGraphContent" className="bodyText">
        Among the known motives for mass shootings, a significant number of mass shootings
        were classified as “acts of terrorism”. Upon further investigation into the summaries
        of mass shootings categorised as acts of terrorism, we presume that “acts of terrorism”
        is used as a general classification for mass shootings without a specific motive, as a
        mass shooting is ultimately considered an act of terrorism, and is thus more than likely
        to be associated with such a motive.

        <br />
        <br />

        On the other hand, “psychological factors” takes up the majority of mass shootings when
        excluding mass shootings with unknown motives. Together with the previous pie chart, this
        illustrates how prevalent mass shootings involving assailants suffering from mental health
        illness are.
      </p>

        <br />
        <br />

      <h2 id="part7" className="bodyHeading">Who are they?</h2>

      <p className="bodyText">
        Another factor to consider is the shooter’s age. Among the list of mass shootings,
        roughly 25% are committed by teenagers, ranging from 12 to 19 years old. Despite gun
        laws in the USA permitting persons 18 years and above to purchase rifles or shotguns,
        roughly 65% of teenage shooters are aged 17 and below.

        <br />
        <br />

        In addition, much can also be said about the accessibility that a legal teenager in the
        USA has to guns. In the current US climate, the major barrier that exists between gun
        control and the 16 million new guns that enter the US market is the debate between the
        constitutional right to bear arms and gun regulation.

        <br />
        <br />

        Looking back at the graph, a total of roughly 60% of shooters are between 20 to 44
        years old. This age group easily takes up the majority of recorded mass shootings from
        1966 to 2017. We surmise that this age group may possibly have key differentiating
        factors for occurences of mass shootings. Perhaps many 20 to 44 year olds have just
        started living on their own, as many tend to move out of their parents’ home at an
        early age, and may not have the financial means to support themselves, resulting in
        venting their frustrations in the form of a mass shooting.
        </p>

      <br />
      <br />

      <article className="pieChartLayout">
        <PieChart chartId="thirdChart" chartAlign={"alignLeft"} pieChartData={occupationsData} innerRadius={100} outerRadius={150} />
        <div className="pieChartDesc">
          <h3 id="part7-1">Percentage of shooters with a background in the military or police force</h3>
          <p>With psychological factors playing such a large role, we looked into the occupations
            of shooters, specifically the military and police, as they are most commonly
            associated with mental and stress issues related to firearms due to post-traumatic
            stress disorder (PTSD) being a common issue faced by uniformed officers, which may
            play a role in inciting a current or former uniformed officer into instigating a mass
            shooting.
            <br />
            <br />
            From the data, we learn that individuals with a military or police background were
            responsible for 7% of all mass shootings in the USA, based on the data set.
            <br />
            <br />
            However, Barbara Vam Dahlen, the founder of non-profit “Give an Hour”, an organisation
            that provides counselling and other support to veterans, states that PTSD “creates a
            risk factor”, but doesn’t necessarily determine whether or not they will initiate a mass
            shooting. 3 out of 10 of the deadliest mass shootings in the U.S. were performed by people
            with a military background. As such, it is clear to see that links to the military or
            police are not a common occurrence in relation to these mass shootings.</p>
        </div>
      </article>

      <br/>
      <br/>

      <h2 id="part8" className="bodyHeading">Conclusion</h2>
      <p className="bodyText">
          While the data may imply that the likelihood of gun violence and mass shootings in
          the USA is influenced by the public accessibility of firearms and the complexity of
          mental health, the opinions of various readers can greatly differ, even if shown the
          same data. As such, instead of providing the reader with a definitive answer, below
          are some of our own speculations regarding the data, for the reader’s consideration,
          and to make their own judgements:

          <br/>
          <br/>

          As seen with California and Nevada, a higher number of mass shootings does not
          necessarily result in a higher rate of injury or fatalities. Additionally, the
          severity of a mass shooting is heavily dependent on multiple factors.

          <br/>
          <br/>

          As we observed earlier, the majority of targets tend to either be family members,
          students, teachers, co-workers, and ex-partners. These are mostly people that one
          might know well and be fairly close to, giving shooters the opportunity to meet
          their targets within a closed space; homes, schools, offices, etc.

          <br/>
          <br/>

          Furthermore, our data has shown that there is a higher percentage of fatalities in
          closed spaces than in open space, which is likely due to the shooter being in closer
          proximity to their targets, increasing their chance of fatally wounding the victims,
          leading to a higher fatality rate.

          <br/>
          <br/>

          As mentioned previously, it is clear that mass shootings have slowly increased over
          time, even when excluding the years 2015 and 2016; but we may also need to consider
          that there are several factors that may have affected this data, as the way that mass
          shootings and the factors around society could have changed and evolved greatly over
          the years. Such factors may include the availability and influence of popular media
          that may have had a dramatic effect on how mass shootings were reported, or adversely
          the amount of attention it places on both the shooter and victims. Additionally, the
          evolution of stressing factors to public mental health have greatly evolved since 1967.

          <br/>
          <br/>

          This is further supported by the fact that the majority of known motives for mass
          shootings is registered as psychological factors in the shooter, suggesting that the
          barrier to mental health care is a significant issue faced by many Americans.

          <br/>
          <br/>

          From the data, we have seen a significant number of minors as the culprits of mass
          shootings, which begs the question of how they came into possession of firearms that
          they are not legally allowed to purchase or own. We speculate one possibility could
          be that parents who own firearms may not have properly secured them, allowing their
          children to easily acquire a weapon they are in illegal possession of.

          <br/>
          <br/>

          On the other hand, shooters from older age groups could have numerous more reasons
          than those mentioned previously. Other than psychological factors, the data shows
          other possibilities include instigating a mass shooting out of anger, frustration,
          revenge, racism, domestic disputes and more, leaning toward the idea that many mass
          shootings come from dissatisfaction from the shooter in their daily lives.</p>

          <br/>
          <br/>

        <footer>
          <p>Andrew Aiello | Thomas Lim | Chan Deng Chiew | Nicholas Ho</p>
        </footer>

    </section>
  )
}

export default App;
