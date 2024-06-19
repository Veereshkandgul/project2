
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { create } from 'ipfs-http-client';

const ipfs = create({
  url: 'http://127.0.0.1:5001',
});

function LandRegistrationComponent({ registerLand }) {
  const [landId, setLandId] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState(["", ""]);
  const [area, setArea] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleRegisterLand = async () => {
    if (imageFile) {
      try {
        const added = await ipfs.add(imageFile);
        const imageUrl = `https://ipfs.io/ipfs/${added.path}`;
        console.log("url "+ imageUrl);

        // Ensure coordinates are strings
        const stringCoordinates = [coordinates[0].toString(), coordinates[1].toString()];

        registerLand(landId, description, imageUrl, stringCoordinates, area);
      } catch (error) {
        setErrorMessage("Error uploading image: " + error.message);
      }
    } else {
      setErrorMessage("Please select an image to upload.");
    }
  };

  const handleLocationError = (error) => {
    setErrorMessage("Error getting current location: " + error.message);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates([position.coords.latitude.toString(), position.coords.longitude.toString()]);
      }, handleLocationError);
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="purchase-component">
      <div id="form" className="form-container">
        <input
          id="landId"
          type="text"
          className="input-r"
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
          placeholder="Land ID"
        />
        <input
          type="text"
          id="description"
          className="input-r"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          id="imageFile"
          type="file"
          className="input-r"
          onChange={handleFileChange}
        />
        <button onClick={getLocation}>Get Current Location</button>
        <input
          type="text"
          id="latitude"
          className="input-r"
          value={coordinates[0]}
          onChange={(e) => setCoordinates([e.target.value, coordinates[1]])}
          placeholder="Latitude"
        />
        <input
          id="longitude"
          type="text"
          className="input-r"
          value={coordinates[1]}
          onChange={(e) => setCoordinates([coordinates[0], e.target.value])}
          placeholder="Longitude"
        />
        <input
          type="text"
          value={area}
          className="input-r"
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          id="area"
        />
        <button onClick={handleRegisterLand}>Register Land</button>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
      {coordinates[0] && coordinates[1] && (
        <div style={{ height: "550px", width: "50%" }} className="map-container">
          <MapContainer center={coordinates.map(coord => parseFloat(coord))} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
            <Marker position={coordinates.map(coord => parseFloat(coord))} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default LandRegistrationComponent;
