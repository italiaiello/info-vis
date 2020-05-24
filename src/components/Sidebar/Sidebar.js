import React from 'react'

const Sidebar = () => {
    return (
        <aside>
          <div class="aside-container">
            <h4>Jump To...</h4>
            <ol>
                <li><a href="#part1">Mass Shootings in the U.S.</a></li>
                <li><a href="#part2">Where do shootings occur most often?</a></li>
                <ol className="subheadings">
                    <li>
                        <a href="#part2-1">Percentage of fatalities and injuries as a result of mass shootings in open or closed spaces</a>
                    </li>
                </ol>
                <li><a href="#part3">Who is being targeted?</a></li>
                <ol className="subheadings">
                    <li>
                        <a href="#part3-1">Shootings involving a specific vs random target</a>
                    </li>
                </ol>
                <li><a href="#part4">Frequency of Shootings</a></li>
                <ol className="subheadings">
                    <li>
                        <a href="#part4-1">Number of mass shootings recorded per year</a>
                    </li>
                </ol>
                <li><a href="#part5">Why do they do it?</a></li>
                <ol className="subheadings">
                    <li>
                        <a href="#part5-1">Did the shooter suffer from a mental health issue?</a>
                    </li>
                </ol>
                <li><a href="#part6">Shootings in relation to mental health and age groups</a></li>
                <li><a href="#part7">Who are they?</a></li>
                <ol className="subheadings">
                    <li>
                        <a href="#part7-1">Percentage of shooters with a background in the military or police force</a>
                    </li>
                </ol>
                <li><a href="#part8">Conclusion</a></li>
            </ol>
          </div>
      </aside>
    )
}

export default Sidebar