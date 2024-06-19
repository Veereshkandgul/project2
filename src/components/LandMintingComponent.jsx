// LandMintingComponent.js
import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";

function LandMintingComponent({ mintNFT }) {
  const [landId, setLandId] = useState("");

  const handleMintNFT = () => {
    mintNFT(landId);
  };

  const AnimatedText = ({ text, delay = 0 }) => {
    const words = text.split(" ");
    return words.map((word, index) => (
      <AnimatedSpan
        key={index}
        style={{ animationDelay: `${delay + index * 0.3}s` }}
      >
        {word}&nbsp;
      </AnimatedSpan>
    ));
  };

  return (
    <div className="mintNft">
      <div className="listingtab mint">
        <h2>Mint NFT</h2>
        <div>
          <input
            type="text"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder="Land ID"
          />
          <button onClick={handleMintNFT}>Mint NFT</button>
        </div>
      </div>

      <div className="NFT-intro">
        <h2>NFT INTRODUCTION</h2>
        <h3>What are NFTs?</h3>
        <p className="first">
          <AnimatedText text="NFTs are unique digital assets verified using blockchain technology. Unlike cryptocurrencies like Bitcoin or Ethereum, which are fungible and can be exchanged on a one-to-one basis, NFTs are one-of-a-kind items. Each NFT has distinct information or metadata that makes it unique, ensuring its singularity and authenticity." />
        </p>
        <h3>How Do NFTs Work?</h3>
        <p className="second">
          <AnimatedText
            text="NFTs are built on blockchain networks, most commonly on Ethereum. The blockchain serves as a decentralized ledger that records the ownership and transaction history of each NFT. When you purchase an NFT, you are essentially buying a digital certificate of ownership for a specific digital asset, which can range from digital art and music to virtual real estate and collectibles."
            delay={14} // Adding delay for second paragraph
          />
        </p>
      </div>
    </div>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedSpan = styled.span`
  display: inline-block;
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards;
`;

export default LandMintingComponent;
