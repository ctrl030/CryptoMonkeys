pragma solidity ^0.5.12;

import "./Monkeycontract.sol";
import "./Ownable.sol";

/*
 * Market place to trade monkeys (should **in theory** be used for any ERC721 token)
 * It needs an existing monkey contract to interact with
 * Note: it does not inherit from the monkey contracts
 * Note: The contract needs to be an operator for everyone who is selling through this contract.
 */
interface IMonkeyMarketplace {

    event MarketTransaction(string TxType, address owner, uint256 tokenId);

    /**
    * Set the current MonkeyContract address and initialize the instance of Monkeycontract.
    * Requirement: Only the contract owner can call.
     */
    function setMonkeyContract(address _MonkeyContractAddress) external;

    /**
    * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
     */
    function getOffer(uint256 _tokenId) external view returns ( address seller, uint256 price, uint256 index, uint256 tokenId, bool active);

    /**
    * Get all tokenId's that are currently for sale. Returns an empty arror if none exist.
     */
    function getAllTokenOnSale() external view  returns(uint256[] memory listOfOffers);

    /** test next, implemented
    * Creates a new offer for _tokenId for the price _price.
    * Emits the MarketTransaction event with txType "Create offer"
    * Requirement: Only the owner of _tokenId can create an offer.
    * Requirement: There can only be one active offer for a token at a time.
    * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
     */
    function setOffer(uint256 _price, uint256 _tokenId) external;

    /** test next, implemented
    * Removes an existing offer.
    * Emits the MarketTransaction event with txType "Remove offer"
    * Requirement: Only the seller of _tokenId can remove an offer.
     */
    function removeOffer(uint256 _tokenId) external;

    /**
    * Executes the purchase of _tokenId.
    * Sends the funds to the seller and transfers the token using transferFrom in Monkeycontract.
    * Emits the MarketTransaction event with txType "Buy".
    * Requirement: The msg.value needs to equal the price of _tokenId
    * Requirement: There must be an active offer for _tokenId
     */
    function buyMonkey(uint256 _tokenId) external payable;
}
