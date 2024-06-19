import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LandRegistrationComponent from "./components/LandRegistrationComponent.jsx";
import LandMintingComponent from "./components/LandMintingComponent.jsx";
import LandListingComponent from "./components/LandListingComponent.jsx";
import LandPurchaseComponent from "./components/LandPurchaseComponent.jsx";
import MyLandComponent from './components/MyLandComponent.jsx';
import "./App.css";
import LandNFT from "./LandNFT.json";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import Web3 from "web3";

import { Contract } from "web3-eth-contract";
import Home from "./components/Home.jsx";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [theme, setTheme] = useState("light"); // State to manage theme


  useEffect(() => {
    // Function to connect to MetaMask
    const connectToMetaMask = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          console.log("Connected to MetaMask");
          setWeb3(web3Instance);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = LandNFT.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            LandNFT.abi,
            "0xd562Db1BdB86aC058b0dFD43f20b72041Fbc9909" //contract address
          );
          setContract(contractInstance);
          const accounts = await web3Instance.eth.getAccounts();
          setConnectedAccount(accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    };

    connectToMetaMask();
  }, []);

  const handleConnectMetaMask = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        console.log("Connected to MetaMask");
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setConnectedAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  console.log({ connectedAccount });


  const registerLand = async (landId, description, image, coordinates, area) => {
    try {
      // Call the registerLand function of your contract instance
      await contract.methods
        .registerLand(landId, description, image, coordinates, area)
        .send({
          from: connectedAccount,
        });
      // Optionally, you can add code to handle successful registration
      console.log("Land registered successfully");
    } catch (error) {
      // Handle errors
      console.error("Error registering land:", error);
    }
  };

  const mintNFT = async (landId) => {
    try {
      // Call the mintNFT function of your contract instance
      await contract.methods.mintNFT(landId).send({
        from: connectedAccount,
      });
      // Optionally, you can add code to handle successful NFT minting
      console.log("NFT minted successfully for land:", landId);
    } catch (error) {
      // Handle errors
      console.error("Error minting NFT for land:", landId, error);
    }
  };

  const listForSale = async (landId, price) => {
    try {
      // Call the listForSale function of your contract instance
      await contract.methods.listForSaleInEther(landId, price).send({
        from: connectedAccount,
      });
      // Optionally, you can add code to handle successful listing for sale
      console.log("Land listed for sale:", landId, "at price:", price);
    } catch (error) {
      // Handle errors
      console.error("Error listing land for sale:", landId, error);
    }
  };

  const buyLand = async (landId, priceInWei) => {
    try {
      await contract.methods.buyLand(landId).send({
        from: connectedAccount,
        value: priceInWei, // Dynamic price from selected land
      });
      console.log("Land purchased successfully:", landId);
    } catch (error) {
      console.error("Error purchasing land:", landId, error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  }, [theme]);

  return (
    <> 
      {!connectedAccount && (
        <button onClick={handleConnectMetaMask}>Connect to MetaMask</button>
      )}
      {connectedAccount && (
        <Router>
          <div className="btn-grp" id="nav-bar">
            <div id="nav-1">
              <h2>Land Management System</h2>
              {/* <p className="logo"></p> */}
            </div>
            <div id="nav-2">
              <Link to="/">Home</Link>
              <Link to="/register">Register</Link>
              <Link to="/mint">Mint-NFT</Link>
              <Link to="/list">List Land for Sale</Link>
              <Link to="/purchase">Purchase-Land</Link>
              <Link to="/mylands">My Land</Link>

              {/* <BsToggle2Off className="custom-toggle-icon"/> */}
              {theme === "light" ? (
                <BsToggle2Off className="custom-toggle-icon" onClick={toggleTheme} />
              ) : (
                <BsToggle2On className="custom-toggle-icon" onClick={toggleTheme} />
              )}
            </div>
          </div>
          <Routes>
            <Route
              path="/register"
              element={
                <LandRegistrationComponent
                  registerLand={registerLand}
                  connectedAccount={connectedAccount}
                />
              }
            />
            <Route
              path="/mint"
              element={
                <LandMintingComponent
                  mintNFT={mintNFT} // Pass mintNFT function as a prop
                  connectedAccount={connectedAccount}
                />
              }
            />
            <Route
              path="/list"
              element={
                <LandListingComponent
                  listForSale={listForSale} // Pass listForSale function as a prop
                  connectedAccount={connectedAccount}
                  contract={contract}
                />
              }
            />

            <Route
              path="/purchase"
              element={
                <LandPurchaseComponent
                  buyLand={buyLand} // Pass buyLand function as a prop
                  connectedAccount={connectedAccount}
                  contract={contract} // Pass the contract object as a prop
                />
              }
            />
            <Route
              path="/mylands"
              element={
                <MyLandComponent 
                  contract={contract} 
                  connectedAccount={connectedAccount} 
                />
              }
            />
            <Route
              path="/"
              element={
                <Home contract={contract} connectedAccount={connectedAccount} />
              }
            />
          </Routes>
        </Router>
      )}
    </>
  );
}


export default App;