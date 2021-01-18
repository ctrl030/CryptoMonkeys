pragma solidity ^0.5.12;

import "./Monkeycontract.sol";
import "./Ownable.sol";
import "./IMonkeyMarketplace.sol";
// preparing safemath to rule out over- and underflow  
import "./Safemath.sol";

contract MonkeyMarketplace is Ownable, IMonkeyMarketplace  {
  using SafeMath for uint256;

  MonkeyContract private _monkeycontract;

  uint256[] listOfOffers;

  struct Offer {
    address payable seller;
    uint256 price;
    uint256 tokenId;    
    bool active;
  }

  Offer[] offersArray; 

  mapping (uint256 => Offer) tokenIdToOfferMapping; 

  mapping (uint256 => uint256) tokenIdtoActiveofferId;

  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  event NewOfferCreated (address offerCreatedBy, uint256 tokenId, uint256 price);

  event OldOfferDeleted (address offerDeletedBy, uint256 tokenId);

  address _monkeyContractAddressInMarket;

  constructor (address _constructorMonkeyContractAddress) public {
    _monkeycontract = MonkeyContract(_constructorMonkeyContractAddress);
  }
  /** 
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
    address monkeyOwner = _monkeycontract.ownerOf(_tokenId);
    require( monkeyOwner == msg.sender);

    //Marketplace contract (this) needs to be an approved operator when the offer is created.
    require(_monkeycontract.isApprovedForAll(msg.sender, address(this)), "Marketplace address needs operator status from monkey owner.");
                   
    // There can only be one active offer for a token at a time.    
    if (tokenIdToOfferMapping[_tokenId].active) {
      // delete mapping entry
      delete tokenIdToOfferMapping[_tokenId];
      // delete offer array entry 
      delete offersArray[_tokenId];    
      // delete active offer ID array entry
      delete tokenIdtoActiveofferId[_tokenId];  
    }
    
    // Creating a new offer from the Offer struct "blueprint"
    Offer memory newOffer = Offer({
      seller: msg.sender,
      price:  uint256(_price),
      tokenId: uint256(_tokenId),      
      active: true
    });

    // saving new offer (it's a struct) to mapping 
    tokenIdToOfferMapping[_tokenId] = newOffer;    

    // saving new offer (it's a struct) to array and giving it a offer ID, first offer will have ID 0, same as its index in array 
    uint256 newOfferId = offersArray.push(newOffer) - 1; 

    tokenIdtoActiveofferId[_tokenId] = newOfferId;

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
    require(tokenIdToOfferMapping[_tokenId].seller == msg.sender);

    // deleting mapping entry
    delete tokenIdToOfferMapping[_tokenId];    

    // deleting array entry
    delete offersArray[_tokenId];       

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
    tokenIdtoActiveofferId[_tokenId], 
    tokenIdToOfferMapping[_tokenId].tokenId,
    tokenIdToOfferMapping[_tokenId].active       
    );
  }

  /**
  * Get all tokenId's that are currently for sale. Returns an empty array if none exist.
  */
  function getAllTokenOnSale() external view returns(uint256[] memory listOfOffers) {
    for (uint256 k = 0; k < offersArray.length; k++) {
      if (offersArray[k].active) {
        listOfOffers[(listOfOffers.length + 1)] = offersArray[k].tokenId;
      }         
    }
    return listOfOffers; 
  }

  /**
  * Executes the purchase of _tokenId.
  * Sends the funds to the seller and transfers the token using transferFrom in Monkeycontract.
  * Emits the MarketTransaction event with txType "Buy".
  * Requirement: The msg.value needs to equal the price of _tokenId
  * Requirement: There must be an active offer for _tokenId
  */
  function buyMonkey(uint256 _tokenId) external payable {
    require(tokenIdToOfferMapping[_tokenId].active == true);

    require(tokenIdToOfferMapping[_tokenId].price == msg.value);

    _monkeycontract.transferFrom(tokenIdToOfferMapping[_tokenId].seller, msg.sender, _tokenId);

  }

}



    
