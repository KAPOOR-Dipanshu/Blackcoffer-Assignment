import React, { useEffect, useState } from 'react';
import Intensity from './components/Intensity';
import Likelihood from './components/Likelihood';
import Relevance from './components/Relevance';
import StartEndYearLineChart from './components/StartEndYearLineChart';
import TopicBarChart from './components/TopicBarChart';
import RegionScatterChart from './components/RegionScatterChart';
import CountryScatterChart from './components/CountryScatterChart';
import Navbar from './components/Navbar'; // Add this import statement

const App = () => {
  
  const [data, setData] = useState(null);
  // Function to fetch data based on filters
  const fetchDataWithFilters = async (filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`https://assignment-api-2ja4.onrender.com/data?${queryParams}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataWithFilters({});
  }, []);

  return (
    <div className="App">
      <Navbar fetchData={fetchDataWithFilters} /> {/* Navbar component */}
      <h1 className="font-bold text-black text-lg">Dashboard</h1>

      {/* First Row */}
      <div className="flex flex-row ml-9">
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">Intensity</h2>
          <Intensity data={data} />
        </div>
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">Likelihood</h2>
          <Likelihood data={data} />
        </div>
      </div>

      <br />
      {/* Second Row */}
      <div className="flex flex-row ml-9">
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">Relevance</h2>
          <Relevance data={data} />
        </div>
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">StartEndYearLineChart</h2>
          <StartEndYearLineChart data={data} />
        </div>
      </div>

      <br />
      {/* Third Row */}
      <div className="flex flex-row ml-9">
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">TopicBarChart</h2>
          <TopicBarChart data={data} />
        </div>
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">RegionScatterChart</h2>
          <RegionScatterChart data={data} />
        </div>
      </div>

      <br />
      {/* Fourth Row */}
      <div className="flex flex-row ml-9">
        <div className="w-1/2 text-center">
          <h2 className="font-bold text-black text-lg">CountryScatterChart</h2>
          <CountryScatterChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
