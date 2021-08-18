// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMonkeyContract is IERC721{
  
  // Creation event, emitted after successful NFT creation with these parameters
  event MonkeyCreated(
    address owner,
    uint256 tokenId,
    uint256 parent1Id,
    uint256 parent2Id,
    uint256 genes
  );
  
  // Breeding event, emitted after successful NFT breeding with these parameters
  event BreedingSuccessful (
    uint256 tokenId, 
    uint256 genes, 
    uint256 birthtime, 
    uint256 parent1Id, 
    uint256 parent2Id, 
    uint256 generation, 
    address owner
  );  

  function getMonkeyContractAddress() external view returns (address);
  
  function breed(uint256 _parent1Id, uint256 _parent2Id) external returns (uint256);
  
  function createDemoMonkey(
    uint256 _genes,
    address _owner
  ) external returns (uint256);

  function getMonkeyDetails(address _owner) external view returns(
    uint256 genes,
    uint256 birthtime,
    uint256 parent1Id,
    uint256 parent2Id,
    uint256 generation,
    address owner,
    address approvedAddress
  );

  function findMonkeyIdsOfAddress(address sender) external view returns (uint256[] memory);

  function showTotalSupply() external view returns (uint256);
  
  /// * @dev Assign ownership of a specific Monekey to an address.
  /// * @dev This poses no restriction on msg.sender
  /// * @param _from The address from who to transfer from, can be 0 for creation of a monkey
  /// * @param _to The address to who to transfer to, cannot be 0 address
  /// * @param _tokenId The id of the transfering monkey  
  function transferNFT(address _from, address _to, uint256 _tokenId) external;
}
