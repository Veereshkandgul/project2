import React from "react";
import { formatEther } from "ethers"; // Corrected import

const Land = ({ land, onSelect }) => {
  const {
    id,
    image,
    firstOwner,
    description,
    coordinates,
    presentOwner,
    area,
    price,
  } = land;

  // Ensure price is treated as a BigNumber by ethers
  const priceInWei = price;
  const priceInEther = formatEther(priceInWei);

  // Log the values to check the conversion
  console.log("Price in Wei:", priceInWei);
  console.log("Price in Ether:", priceInEther);

  return (
    <div className="card">
      <img src={image} alt="Land" />
      <div id="lpart">
        <p>Image: <a href={image} target="_blank" rel="noopener noreferrer">View Image</a></p>
        <h3>LandID : {id.toString()}</h3>
        <p>Description : {description}</p>
        <div id="aprice">
          <h3>Area : {area.toString()}</h3>
          <h3>Price : {priceInEther} Ether</h3>
        </div>
        <div id="location">
          <h3>Latitude : {coordinates[0]}</h3>
          <h3>Longitude : {coordinates[1]}</h3>
        </div>
        <h4 className="owner">Previous Owner</h4>
        <h4>{firstOwner}</h4>
        <h4 className="owner">Current Owner </h4>
        <h4>{presentOwner}</h4>
        <button onClick={() => onSelect(id, priceInEther)}>Select Land</button>
      </div>
    </div>
  );
};

export default Land;
