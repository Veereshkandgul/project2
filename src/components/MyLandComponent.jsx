
import React, { useState, useEffect } from 'react';
import { formatEther } from 'ethers'; // Import formatEther

function MyLandComponent({ contract, connectedAccount }) {
  const [userLands, setUserLands] = useState([]);

  useEffect(() => {
    const fetchUserLands = async () => {
      try {
        // Call the getUserLandDetails function of the contract to fetch the user's lands
        const userLandIds = await contract.methods.getUserLandDetails().call({ from: connectedAccount });
        const landsArray = [];
        for (const landId of userLandIds) {
          // Fetch details of each land using the getLand function
          const land = await contract.methods.getLand(landId).call();
          landsArray.push({ id: landId, ...land });
        }
        setUserLands(landsArray);
      } catch (error) {
        console.error('Error fetching user lands:', error);
      }
    };

    // Call the fetchUserLands function when the component mounts
    fetchUserLands();
  }, [contract, connectedAccount]); // Dependency array ensures fetch only on contract or account change

  return (
    <div className='my-land-comp'>
      <h2>My Lands</h2>
      <div className='my-lands hide-scrollbar'>
        {userLands.length > 0 ? (
          userLands.map((land, index) => {
            const priceInEther = formatEther(land.price.toString()); // Convert price to ether

            return (
              <div key={index}>
                <div className="card">
                  <img src={land.image} alt="Land" />
                  <div id="lpart">
                    <p>Image: <a href={land.image} target="_blank" rel="noopener noreferrer">View Image</a></p>
                    <h3>LandID : {land.id.toString()}</h3>
                    <p>Description : {land.description}</p>
                    <div id="aprice">
                      <h3>Area : {land.area.toString()}</h3>
                      <h3>Price : {priceInEther} Ether</h3>
                    </div>
                    <div id="location">
                      <h3>Latitude : {land.coordinates[0]}</h3>
                      <h3>Longitude : {land.coordinates[1]}</h3>
                    </div>
                    <h4 className="owner">Previous Owner</h4>
                    <h4>{land.firstOwner}</h4>
                    <h4 className="owner">Current Owner </h4>
                    <h4>{land.presentOwner}</h4>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No lands owned by this account.</p>
        )}
      </div>
    </div>
  );
}

export default MyLandComponent;
