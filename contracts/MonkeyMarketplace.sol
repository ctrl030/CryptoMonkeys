pragma solidity ^0.5.12;

import "./Monkeycontract.sol";
import "./Ownable.sol";
import "./IMonkeyMarketplace.sol";
// preparing safemath to rule out over- and underflow  
import "./Safemath.sol";

contract MonkeyMarketplace is Ownable, IMonkeyMarketplace  {
  using SafeMath for uint256;

  Monkeycontract private _monkeycontract;

  struct Offer {
    address payable seller;
    uint256 price;
    uint256 tokenId;    
    bool active;
  }

  Offer[] offersArray;

  mapping (uint256 => Offer) tokenIdToOfferMapping;

  uint256 indexInArray;

  // used to keep track of owners and their crypto monkeys (see below) xxxx
  // owner to tokenid to position in this array: _owners2tokenIdArrayMapping xxxx
  mapping(address => mapping(uint256 => uint256)) public offerPositionsMapping;




  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  event NewOfferCreated (address offerCreatedBy, uint256 tokenId, uint256 price);

  event OldOfferDeleted (address offerDeletedBy, uint256 tokenId);

  // MonkeyContract address
  address _monkeyContractAddressInMarket;   
  

  constructor() public {
    setOffer(10000000000, 0);
    offersArray[activeOfferIdForTokenIdMapping[0]].active = false;
  }



  /** xxxx
  * Set the current MonkeyContract address and initialize the instance of Monkeycontract.
  * Requirement: Only the contract owner can call.
  */
  function setMonkeyContract(address _newMonkeyContractAddress) external onlyOwner {
    _monkeyContractAddressInMarket = _newMonkeyContractAddress;
  }

  /**
  * Creates a new offer for _tokenId for the price _price.
  * Emits the MarketTransaction event with txType "Create offer"
  * Requirement: Only the owner of _tokenId can create an offer.
  * Requirement: There can only be one active offer for a token at a time.
  * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
  */
    
  function setOffer(uint256 _price, uint256 _tokenId) external {    

    //  Only the owner of _tokenId can create an offer.

    address monkeyOwner = _monkeyIdsAndTheirOwnersMapping[_tokenId];

    require( monkeyOwner == msg.sender);

    //Marketplace contract (this) needs to be an approved operator when the offer is created.
    require(operatorApprovalsMapping[msg.sender][this] == _approved);

    // There can only be one active offer for a token at a time.
    if (activeOfferIdForTokenIdMapping[_tokenId] != 0) {
      offersArray[activeOfferIdForTokenIdMapping[_tokenId]].active = false; 
    }

    // problematic to sync array and mapping
    Offer memory newOffer = Offer({
      seller: msg.sender,
      price:  uint256(_price),
      tokenId: uint256(_tokenId),      
      active: true
    });

    // first offer should have offerId 0, test xxx
    uint256 offerId = offersArray[].push(newOffer) - 1;

    // should always have the newest, only active offerId for a tokenId
    activeOfferIdForTokenIdMapping[_tokenId] = offerId;



    emit MarketTransaction("Create offer", monkeyOwner, _tokenId);

    emit NewOfferCreated(msg.sender, _tokenId, _price);

  }

  /**
  * Removes an existing offer.
  * Emits the MarketTransaction event with txType "Remove offer"
  * Requirement: Only the seller of _tokenId can remove an offer.
  */
  function removeOffer(uint256 _tokenId) external {

    //  Only the owner of _tokenId can delete an offer.
    require(_monkeyIdsAndTheirOwnersMapping[_tokenId] == msg.sender);

    offersArray[activeOfferIdForTokenIdMapping[_tokenId]].active = false; 

    tokenIdToOfferMapping[_tokenId] = 0 ;

    emit OldOfferDeleted (msg.sender, _tokenId);
  }

  /**
  * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
  */
  function getOffer(uint256 _tokenId) external view returns ( address seller, uint256 price, uint256 index, uint256 tokenId, bool active)
  {
    return (
    tokenIdToOfferMapping[_tokenId].seller,
    tokenIdToOfferMapping[_tokenId].price,
    tokenIdToOfferMapping[_tokenId].index,
    tokenIdToOfferMapping[_tokenId].tokenId,
    tokenIdToOfferMapping[_tokenId].active       
    );
  }





}