//A simple auction contract
import { context, u128, PersistentMap, PersistentVector, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
/** 
 * Exporting a new class SimpleAuction so it can be used outside of this file.
 */
@nearBindgen
export class SimpleAuction {
    id: u32;
    beneficiary: string;
    //In milliseconds
    auctionEndTime: i64;
    highestBidder: string;
    highestBid: u128;
    bidsDistributed: boolean;
    ended: boolean;

    constructor(beneficiaryAccount: string, biddingTime: u32) {

        /*
        Generates a random number for the auctionId.
        */
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        const currentDate = Date.now();
        this.id = roll;
        this.beneficiary = beneficiaryAccount;
        this.auctionEndTime = biddingTime + currentDate;
        this.ended = false;
        this.highestBid = u128.Zero;
        this.bidsDistributed = false;
    }

}

//Create a persistentMap to store auctions and auctionIDs
export const auctions = new PersistentMap<u32, SimpleAuction>("a");
//Create a persistentMap to store the account and their bid
export const pendingReturns = new PersistentMap<string, u128>("p");
//Create a persisten vector to store all the bid accounts(in sorted order)
export const bids = new PersistentVector<string>("b");

//Create an auction 
export function createAuction(biddingTime: u32) : u32 {
    const auction = new SimpleAuction(context.sender, biddingTime);
    auctions.set(auction.id,auction);
    return auction.id;
}

//Used for bidding
export function bid(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);

    const currentDate = Date.now();
    if(currentDate > auction.auctionEndTime){
        return false;
    }

    if(context.attachedDeposit < auction.highestBid) {
        return false;
    }

    if (auction.ended){
        return false;
    }

    pendingReturns.set(context.sender, context.attachedDeposit);
    auction.highestBid = context.attachedDeposit;
    auction.highestBidder = context.sender;

    bids.push(context.sender);
    auctions.set(auction.id, auction);
   
    return true;
}

//End the auction
export function auctionEnd(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);

    const currentDate = Date.now();
    if(currentDate > auction.auctionEndTime){
        return false;
    }

    if (auction.ended){
        return false;
    }

    auction.ended = true;
    logging.log("Auction has ended now!");

    const highestBidderAddress = bids.pop();
    //const highestBidderAddress = bids[bids.length-1];
    const highestBidderAmount = pendingReturns.getSome(highestBidderAddress);
    
    const to_beneficiary = ContractPromiseBatch.create(auction.beneficiary);
    to_beneficiary.transfer(highestBidderAmount);

    distributeFunds(auctionId);
    return true;
}

//Distribute funds after auction ends
export function distributeFunds(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    while(bids.length !=0) {

        let bidder = bids.pop();
        let bidAmount = pendingReturns.getSome(bidder);
        const to_beneficiary = ContractPromiseBatch.create(bidder);
        to_beneficiary.transfer(bidAmount);
    }
    if(bids.length == 0){
        auction.bidsDistributed = true;
        auctions.set(auctionId, auction);
        return true;
    }
    else {
        return false;
    }
    
}

//Getter for all the bids

//Returns all the active bids
export function getBids(): Map<string, u128> {
  let tempBidsMap = new Map<string, u128>();

  if(bids.length != 0){
    for(let i =0; i< bids.length; i++){
        let bidAmount = pendingReturns.getSome(bids[i]);
        tempBidsMap.set(bids[i], bidAmount)
    }
  }
  return tempBidsMap;
}
