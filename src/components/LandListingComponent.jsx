// LandListingComponent.js
import React, { useState, useEffect } from "react";
import { formatEther } from "ethers"; // Import formatEther

function LandListingComponent({ listForSale, contract, connectedAccount }) {
  const [landId, setLandId] = useState("");
  const [price, setPrice] = useState("");

  const [lands, setLands] = useState([]);
  const [userLands, setUserLands] = useState([]);

  useEffect(() => {
    const fetchUserLands = async () => {
      try {
        // Call the getUserLandDetails function of the contract to fetch the user's lands
        const userLandIds = await contract.methods
          .getUserMintedLands(connectedAccount)
          .call();
        const landsArray = [];
        for (const landId of userLandIds) {
          // Fetch details of each land using the getLand function
          const land = await contract.methods.getLand(landId).call();
          landsArray.push({ id: landId, ...land });
        }
        setUserLands(landsArray);
      } catch (error) {
        console.error("Error fetching user lands:", error);
      }
    };

    // Call the fetchUserLands function when the component mounts
    fetchUserLands();
  }, [contract, connectedAccount]);

  const handleListForSale = () => {
    listForSale(landId, price);
  };

  return (
    <div className="listedtab">
      <div className="mintedlist hide-scrollbar">
        {userLands.length > 0 ? (
          userLands.map((land, index) => {
            const priceInEther = formatEther(land.price.toString()); // Convert price to ether

            return (
              <div key={index}>
                <div className="card">
                  <img src={land.image} alt="Land" />
                  <div id="lpart">
                    <p>
                      Image:{" "}
                      <a
                        href={land.image}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Image
                      </a>
                    </p>
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
          <div className="nolands">
            <p>No lands owned by this account.</p>
          </div>
        )}
      </div>

      <div className="listingtab">
        <h2>List Land for Sale</h2>
        <div>
          <input
            type="text"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder="Land ID"
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <button onClick={handleListForSale}>List for Sale</button>
        </div>
      </div>
    </div>
  );
}

export default LandListingComponent;
