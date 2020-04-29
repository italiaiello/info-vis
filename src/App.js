import React, { useState } from 'react';

import LineGraph from './components/LineGraph/LineGraph'
import AnimatedBarGraph from './components/AnimatedBarGraph/AnimatedBarGraph'

import './App.css';

function App() {

  // Line graph data
  const [lineGraphData, setLineGraphData] = useState([20, 30, 45, 60, 20, 65, 75])

  // Bar graph data
  const [barGraphData, setBarGraphData] = useState([20, 30, 45, 60, 20, 65, 75])
  

  return (
    <section className="graphs">
      <LineGraph lineGraphData={lineGraphData} setLineGraphData={setLineGraphData} />
      <br />
      <AnimatedBarGraph barGraphData={barGraphData} setBarGraphData={setBarGraphData} />
    </section>
  );
}

export default App;
