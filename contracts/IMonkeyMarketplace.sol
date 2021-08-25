// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/*
 * Market place to trade monkeys (should be adapted to be used for any ERC721 token)
 * It needs an existing monkey contract to interact with
 * Note: it does not inherit from the main monkey contract
 * Note: everyone who wants to sell via this contract has to give it operator status in the main contract using the imported ERC721 setApprovalForAll function
*/
interface IMonkeyMarketplace {

    event MarketTransaction(string TxType, address owner, uint256 tokenId);

    event MonkeySold (address seller, address buyer, uint256 price, uint256 tokenId);     

    /*
    * shows if an NFT is on sale in this contract. 
    * Note: Tokens that are on sale in this contract cannot be transferred via main contract
    * Note: To transfer an token via main contract that is on sale here, first use removeOffer for the Token ID
    */
    function isTokenOnSale(uint256 _tokenId) external view returns (bool tokenIsOnSale);

    /**
    * Get the details about an offer for _tokenId. Throws an error if there is no active offer for _tokenId.
    */
    function getOffer(uint256 _tokenId) external view returns ( address seller, uint256 price, uint256 index, uint256 tokenId, bool active);

    /**
    * Get all tokenId's that are currently for sale. Returns an empty array if none exist.
    */
    function getAllTokenOnSale() external view  returns(uint256[] memory listOfOffers);

    /** 
    * Creates a new offer for _tokenId for the price _price.
    * Emits the MarketTransaction event with txType "Create offer"
    * Requirement: Only the owner of _tokenId can create an offer.
    * Requirement: There can only be one active offer for a token at a time.
    * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
    */
    function setOffer(uint256 _price, uint256 _tokenId) external;

    /** 
    * Removes an existing offer.
    * Emits the MarketTransaction event with txType "Remove offer"
    * Requirement: Only the seller of _tokenId can remove an offer.
    */
    function removeOffer(uint256 _tokenId) external;

    /**
    * Executes the purchase of _tokenId.
    * Sends the funds to the seller and transfers the token using transferNFT in Monkeycontract.
    * Emits the MarketTransaction event with txType "Buy".
    * Emits the event MonkeySold
    * Requirement: The msg.value needs to equal the price of _tokenId
    * Requirement: There must be an active offer for _tokenId
     */
    function buyMonkey(uint256 _tokenId) external payable;
    
}
