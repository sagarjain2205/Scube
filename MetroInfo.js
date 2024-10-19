



import React, { useState, useEffect } from 'react';
import './MetroInfo.css'; // Import the CSS file

function MetroInfo() {
  const [metroData, setMetroData] = useState({
    closingTime: 30,
    compartments: [0, 0, 0],
  });

  const [stationData, setStationData] = useState([
    {
      stationName: 'Station A',
      peakHourCount: 50,
      offPeakHourCount: 20,
    },
    {
      stationName: 'Station B',
      peakHourCount: 70,
      offPeakHourCount: 25,
    },
    {
      stationName: 'Station C',
      peakHourCount: 80,
      offPeakHourCount: 35,
    },
  ]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:5000/metro-info')
        .then(response => response.json())
        .then(data => {
          if (data.closingTime === 0) {
            setMetroData({
              closingTime: 0,
              compartments: [0, 0, 0],
            });
          } else {
            const adjustedCompartments = [
              Math.max(70, Math.min(data.compartments[0], 100)),
              Math.max(70, Math.min(data.compartments[1], 100)),
              Math.min(data.compartments[2], 50),
            ];

            setMetroData({
              closingTime: data.closingTime,
              compartments: adjustedCompartments,
            });
          }
          setStationData(data.nearestStations || stationData);
        })
        .catch(error => console.log('Error fetching data:', error));
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [stationData]);

  const getCompartmentClass = (count) => {
    return count > 60 ? 'over-capacity' : 'normal-capacity';
  };

  const getClosingTimeClass = (time) => {
    return time > 10 ? 'safe-time' : 'warning-time';
  };

  const getPeopleCountClass = (count, threshold) => {
    return count > threshold ? 'over-capacity' : 'normal-capacity';
  };

  return (
    <div className='container'>
      <h1>Metro Gate Closing Countdown</h1>
      <p className={getClosingTimeClass(metroData.closingTime)} id='data'>
        {metroData.closingTime} seconds remaining
      </p>

      <h2>Number of People in Metro Compartments</h2>
      <p className={getCompartmentClass(metroData.compartments[0])}>
        Compartment 1: {metroData.compartments[0]} people
      </p>
      <p className={getCompartmentClass(metroData.compartments[1])}>
        Compartment 2: {metroData.compartments[1]} people
      </p>
      <p className={getCompartmentClass(metroData.compartments[2])}>
        Compartment 3: {metroData.compartments[2]} people
      </p>

      <h2>Nearest Metro Stations</h2>
      <table className='station-table'>
        <thead>
          <tr>
            <th>Station Name</th>
            <th>Peak Hour People Count</th>
            <th>Off-Peak Hour People Count</th>
          </tr>
        </thead>
        <tbody>
          {stationData.map((station, index) => (
            <tr key={index}>
              <td>{station.stationName}</td>
              <td className={getPeopleCountClass(station.peakHourCount, 60)}>
                {station.peakHourCount} people
              </td>
              <td className={getPeopleCountClass(station.offPeakHourCount, 30)}>
                {station.offPeakHourCount} people
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MetroInfo;