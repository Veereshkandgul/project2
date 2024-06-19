// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LandNFT is ERC721 {
    constructor() ERC721("LandNFT", "LAND") {}

    struct Land {
        address firstOwner;
        address presentOwner;
        string description;
        string image;
        string[2] coordinates;
        uint256 area;
        bool exists;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Land) public lands;
    mapping(address => uint256[]) public userMintedLands;

    event LandRegistered(uint256 landId, address owner);

    uint256[] public listedLands;

    function registerLand(uint256 id, string memory description, string memory image, string[2] memory coordinates, uint256 area) public {
        require(!lands[id].exists, "Land already registered");

        // Check if a land parcel with the same coordinates already exists
        for (uint256 i = 0; i < listedLands.length; i++) {
            uint256 existingLandId = listedLands[i];
            if (keccak256(abi.encodePacked(lands[existingLandId].coordinates[0])) == keccak256(abi.encodePacked(coordinates[0])) &&
                keccak256(abi.encodePacked(lands[existingLandId].coordinates[1])) == keccak256(abi.encodePacked(coordinates[1]))) {
                revert("Land with the same coordinates already exists");
            }
        }

        lands[id] = Land(msg.sender, msg.sender, description, image, coordinates, area, true, 0, false);

        emit LandRegistered(id, msg.sender);
    }

    function mintNFT(uint256 landId) public {
        require(lands[landId].exists, "Land parcel does not exist");
        require(lands[landId].firstOwner == msg.sender, "Unauthorized minting");

        _mint(msg.sender, landId);
        userMintedLands[msg.sender].push(landId);
    }

    function listForSaleInEther(uint256 landId, uint256 priceInEther) public {
    require(lands[landId].exists, "Land parcel does not exist");
    require(lands[landId].presentOwner == msg.sender, "You are not the owner of this land");

    // Convert the price from Ether to wei
    uint256 priceInWei = priceInEther * 1 ether;

    lands[landId].price = priceInWei;
    lands[landId].isListed = true;
    listedLands.push(landId);
}

    function buyLand(uint256 landId) public payable {
    Land storage land = lands[landId];

    require(land.exists, "Land parcel does not exist");
    require(land.presentOwner != address(0), "Land parcel owner address is invalid");
    require(msg.value >= land.price, "Insufficient funds to buy this land");

    // Transfer the ownership of the NFT
    _transfer(land.presentOwner, msg.sender, landId);

    // Transfer the payment to the previous owner
    payable(land.presentOwner).transfer(msg.value);

    // Update land details
    address previousOwner = land.presentOwner;
    land.presentOwner = msg.sender;
    land.price = 0;
    land.isListed = false;

    // Remove the land ID from listedLands
    for (uint256 i = 0; i < listedLands.length; i++) {
        if (listedLands[i] == landId) {
            listedLands[i] = listedLands[listedLands.length - 1];
            listedLands.pop();
            break;
        }
    }

    // Remove the land ID from the seller's minted list
    uint256[] storage sellerMintedLands = userMintedLands[previousOwner];
    for (uint256 i = 0; i < sellerMintedLands.length; i++) {
        if (sellerMintedLands[i] == landId) {
            sellerMintedLands[i] = sellerMintedLands[sellerMintedLands.length - 1];
            sellerMintedLands.pop();
            break;
        }
    }

    // Add the land ID to the buyer's minted list
    userMintedLands[msg.sender].push(landId);
}


    function getUserLandDetails() public view returns (uint256[] memory) {
        uint256 userLandCount = 0;

        // Count the number of lands owned by the caller
        for (uint256 i = 0; i < listedLands.length; i++) {
            uint256 landId = listedLands[i];
            if (lands[landId].presentOwner == msg.sender) {
                userLandCount++;
            }
        }

        // Check if the caller owns any land
        require(userLandCount > 0, "Caller does not own any land");

        // Create an array to store the land IDs owned by the caller
        uint256[] memory userLandIds = new uint256[](userLandCount);
        uint256 index = 0;

        // Populate the array with land IDs owned by the caller
        for (uint256 j = 0; j < listedLands.length; j++) {
            uint256 landId = listedLands[j];
            if (lands[landId].presentOwner == msg.sender) {
                userLandIds[index] = landId;
                index++;
            }
        }

        return userLandIds;
    }

    function getListedLands() public view returns (uint256[] memory) {
        return listedLands;
    }

    function getUserMintedLands(address user) public view returns (uint256[] memory) {
        return userMintedLands[user];
    }

    function getLand(uint256 landId) public view returns (address firstOwner, address presentOwner, string memory description, string memory image, string[2] memory coordinates, uint256 area, bool exists, uint256 price, bool isListed) {
        Land storage land = lands[landId];
        return (land.firstOwner, land.presentOwner, land.description, land.image, land.coordinates, land.area, land.exists, land.price, land.isListed);
    }
}
