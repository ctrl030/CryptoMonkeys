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

  // public function to show contract's own address
  function getMonkeyContractAddress() external view returns (address);
  
  /// * @dev combining two owned NFTs creates a new third one
  /// * @dev needs BananaToken, available from faucet in BananaToken.sol
  /// * @dev returns the Token ID of the new CryptoMonkey NFT 
  /// * @param _parent1Id The Token ID of the first "parent" CryptoMonkey NFT 
  /// * @param _parent2Id TThe Token ID of the second "parent" CryptoMonkey NFT
  
  function breed(uint256 _parent1Id, uint256 _parent2Id) external returns (uint256);
  
  // Function to mint demo Monkey NFTs with hardcoded generation 99
  // needs BananaToken, available from faucet in BananaToken.sol
  function createDemoMonkey(
    uint256 _genes,
    address _owner
  ) external returns (uint256);

  // returns all the main details of a CryptoMonkey NFT
  function getMonkeyDetails(address _owner) external view returns(
    uint256 genes,
    uint256 birthtime,
    uint256 parent1Id,
    uint256 parent2Id,
    uint256 generation,
    address owner,
    address approvedAddress
  );

  // returns an array with the NFT Token IDs that the provided sender address owns
  function findMonkeyIdsOfAddress(address sender) external view returns (uint256[] memory); 
  
  /// * @dev Assign ownership of a specific CryptoMonkey NFT to an address.
  /// * @dev This poses no restriction on msg.sender
  /// * @dev Once onlyOwner has connected a market (_marketConnected true), NFTs cannot be sent via this function while on sale 
  /// * @param _from The address from who to transfer from, can be 0 for creation of a monkey
  /// * @param _to The address to who to transfer to, cannot be 0 address
  /// * @param _tokenId The Token ID of the transferring CryptoMonkey NFT  
  function transferNFT(address _from, address _to, uint256 _tokenId) external;

  // overriding ERC721's function, including whenNotPaused for added security
  function transferFrom(address from, address to, uint256 tokenId) external override;

  // overriding ERC721's function, including whenNotPaused for added security
  function safeTransferFrom(address from, address to, uint256 tokenId) external override;

  // overriding ERC721's function, including whenNotPaused for added security
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) external override;

}
