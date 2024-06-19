
// import React, { useState, useEffect } from "react";
// import Land from "./Land";

// function LandPurchaseComponent({ buyLand, contract }) {
//   const [lands, setLands] = useState([]);
//   const [selectedLandId, setSelectedLandId] = useState("");
//   const [selectedLandPrice, setSelectedLandPrice] = useState(0);

//   useEffect(() => {
//     // Fetch land details using the existing getLand function in the contract
//     const fetchListedLands = async () => {
//       try {
//         const listedLandsIds = await contract.methods.getListedLands().call();
//         const landsArray = [];
//         for (const landId of listedLandsIds) {
//           const land = await contract.methods.getLand(landId).call();
//           landsArray.push({ id: landId, ...land });
//         }
//         setLands(landsArray);
//       } catch (error) {
//         console.error('Error fetching listed lands:', error);
//       }
//     };

//     fetchListedLands();
//   }, [contract]);

//   const handleSelectLand = (landId, price) => {
//     setSelectedLandId(landId);
//     setSelectedLandPrice(Number(price));
//   };

//   const handleBuyLand = async () => {
//     if (!selectedLandId) {
//       console.error("Please select a land to purchase.");
//       return;
//     }

//     try {
//       await buyLand(selectedLandId, selectedLandPrice);
//       console.log("Land purchased successfully!");
//       // Optionally, clear selection or refetch lands to reflect changes
//     } catch (error) {
//       console.error("Error purchasing land:", error);
//       // Handle errors appropriately, e.g., display error message to user
//     }
//   };

//   const selectedLand = lands.find(land => land.id === selectedLandId);

//   return (
//     <div>
//       <h2 className="h2Class">Lands For Sale</h2>
//       <div className="displayLands hide-scrollbar">
//         {lands.map((land) => (
//           <div key={land.id}>
//             <Land land={land} onSelect={handleSelectLand} />
//           </div>
//         ))}
//       </div>
//       {selectedLand && (
//         <div className="confirmationTab">
//           {/* <div className="confirmationTab"> */}
//             <h2>Selected Land Details :</h2>
//             {/* <p>Description: {selectedLand.description}</p> */}
//             <p>Coordinates: {selectedLand.coordinates[0]}, {selectedLand.coordinates[1]}</p>
//             <p>Area: {selectedLand.area.toString()}</p>
//             <p>Price: {selectedLandPrice.toString()}</p>
//             <button onClick={handleBuyLand}>Buy Land</button>
//           {/* </div> */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default LandPurchaseComponent;

import React, { useState, useEffect } from "react";
import Land from "./Land";
import Web3 from "web3";
import { formatEther } from "ethers"; // Correct import



function LandPurchaseComponent({ buyLand, contract }) {
  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState("");
  const [selectedLandPrice, setSelectedLandPrice] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Fetch land details using the existing getLand function in the contract
    const fetchListedLands = async () => {
      try {
        const listedLandsIds = await contract.methods.getListedLands().call();
        const landsArray = [];
        for (const landId of listedLandsIds) {
          const land = await contract.methods.getLand(landId).call();
          landsArray.push({ id: landId, ...land });
        }
        setLands(landsArray);
      } catch (error) {
        console.error('Error fetching listed lands:', error);
      }
    };

    fetchListedLands();
  }, [contract]);

  const handleSelectLand = (landId, price) => {
    setSelectedLandId(landId);
    setSelectedLandPrice(Number(price));
  };

  const handleBuyLand = async () => {
    if (!selectedLandId) {
      console.error("Please select a land to purchase.");
      return;
    }

    setIsPurchasing(true);

    try {
      await buyLand(selectedLandId, Web3.utils.toWei(selectedLandPrice.toString(), "ether"));
      console.log("Land purchased successfully!");
      // Optionally, clear selection or refetch lands to reflect changes
      setSelectedLandId("");
      setSelectedLandPrice(0);
      // fetchListedLands(); 
    } catch (error) {
      console.error("Error purchasing land:", error);
      // Handle errors appropriately, e.g., display error message to user
    } finally {
      setIsPurchasing(false);
    }
  };

  // const selectedLand = lands.find(land => land.id === selectedLandId);

  const selectedLand = lands.find(land => land.id === selectedLandId);
  const selectedLandPriceInEther = selectedLand ? formatEther(selectedLandPrice.toString()) : '0';

  return (
    <div>
      <h2 className="h2Class">Lands For Sale</h2>
      <div className="displayLands hide-scrollbar">
        {lands.map((land) => (
          <div key={land.id}>
            <Land land={land} onSelect={handleSelectLand} />
          </div>
        ))}
      </div>
      {selectedLand && (
        <div className="confirmationTab">
          <h2>Selected Land Details :</h2>
          <p>Coordinates: {selectedLand.coordinates[0]}, {selectedLand.coordinates[1]}</p>
          <p>Area: {selectedLand.area.toString()}</p>
          <p>Price: {selectedLandPriceInEther} ETH</p>
          {/* <p>Price: {Web3.utils.fromWei(selectedLandPrice.toString(), "ether")} ETH</p> */}
          <button onClick={handleBuyLand} disabled={isPurchasing}>
            {isPurchasing ? "Purchasing..." : "Buy Land"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LandPurchaseComponent;

