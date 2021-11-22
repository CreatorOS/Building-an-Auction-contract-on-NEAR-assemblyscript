# Building an auction contract on NEAR
In this quest, we will learn how to build an auction smart contract on NEAR using AssemblyScript. This contract will allow users to create auctions, place bids, end auctions, and distribute funds. This contract is easy to understand, no overcomplications. Let's get right to it!
## Writing the SimpleAuction class fields
First, we need to create a class that will be the base stone for the contract's state. You see a couple of imports from NEAR's AssemblyScript SDK:
```ts
import { context, u128, PersistentMap, PersistentVector, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
```
Take a look at the class below, we will write the constructor body in the next subquest:
```ts
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
     constructor() {
        
     }
}
```
## Writing SimpleAuction's constructor:
Picking up from where we left, let's write the parameters list and populate SimpleAuction's fields. You can see the parameters the constructor takes:
- beneficiaryAccount: the Near account id of the auction creator.
- biddingTime: the "expiration period" of the auction.
You have to initialize state fields like the following:
STEP 1 : initialize id with the random value generated (roll).
STEP 2 : initialize the state field "beneficiary" with the benificiaryAccount parameter.
STEP 3 : initialize auctionEndTime with the sum of biddingTime and current date.
STEP 4 : initialize the state field "ended" with false.
STEP 5 : initialize the highestBid field with zero. You can do it using u128.Zero (from the imports at the beginning).
STEP 6 : initiliaze bidsDistributed with false. 
```ts
constructor(beneficiaryAccount: string, biddingTime: u32) {
        /*
        Generates a random number for the id.
        */
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        const currentDate = Date.now();
        this.id = /*STEP 1*/;
        /*STEP 2*/;
        /*STEP 3*/;
        /*STEP 4*/;
        /*STEP 5*/;
        /*STEP 6*/;
    }
```
Cool! SimpleAuction is ready now, let's continue on.

## Starting with functionality - creating an auction
In this subquest, we will write a function that creates an auction. but before this, let's create some helpful data structures:
```ts
//Create a persistentMap to store auctions and auctionIDs
export const auctions = new PersistentMap<u32, SimpleAuction>("a");
//Create a persistentMap to store the account and their bid
export const pendingReturns = new PersistentMap<string, u128>("p");
//Create a persistentVector to store all the bid accounts(in sorted order)
export const bids = new PersistentVector<string>("b");
```
those will help us store and retireve all the data we need.
Now straight to the createAuction function, You have to write two things here:
Look at he parameter list for the SimpleAuction constructor, as mentioned previously, there are two of them. the first one (beneficiaryAccount) should be set to context.sender (the caller's NEAR account id). the second one (biddingTime) is provided as a createAuction() parameter.
STEP 1 : pass the appropriate values as parameters.
STEP 2 : return the id, the same one used in createAuction in the second line.  
```ts
export function createAuction(biddingTime: u32) : u32 {
    const auction = new SimpleAuction(/*STEP 1*/);
    auctions.set(auction.id,auction);
    /*STEP 2*/;
}
```
Great, ready to go further?
## Moving on - bidding:
Now to the real deal, we will write our bidding function. This function receives a 32-bit unsigned integer and returns a boolean. You have a couple of things to do here, but all that you are going to write in this subquest is either context.sender or context.attachedDeposit. Remeber those? the caller's id and funds sent, respectively. 
STEP 1 : check if the funds are sufficient to bid.
STEP 2 : this set() function takes two parameters, check pendingReturns key:value pair and write these parameters.
STEP 3 : set this auction's highest bid.
STEP 4 : and highest bidder.
STEP 5 : store the caller's id in bids.  
```ts
export function bid(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    const currentDate = Date.now();
    if(currentDate > auction.auctionEndTime){
        return false;
    }
    if(/* STEP 1*/ < auction.highestBid) {
        return false;
    }
    if (auction.ended){
        return false;
    }
    pendingReturns.set(/*STEP 2*/);
    auction.highestBid = /*STEP 3*/;
    auction.highestBidder = /*STEP 4*/;
    bids.push(/*STEP 5*/;
    auctions.set(auction.id, auction);  
    return true;
}
```
Now that we wrote the main functionality of this contract, let's build on it!
## After the auction - Ending the auction properly
Now we will write a function that ends the auction. it marks the auction ended, sends the highest bid to the beneficiary, and refunds the other particpants. this refunding happens in distributeFunds() function, we will write it in the next subquest.
STEP 1 : mark the auction as ended.
STEP 2 : prepare to send funds to the auction's beneficiary, pass the latter as a prameter, the only parameter to ContractPromiseBatch.create().
STEP 3 : transfer the highest bidder amount to the beneficiary. 
```ts
export function auctionEnd(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    const currentDate = Date.now();
    if(currentDate > auction.auctionEndTime){
        return false;
    }
    if (auction.ended){
        return false;
    }
    auction.ended = /*STEP 1*/;
    logging.log("Auction has ended now!");
    const highestBidderAddress = bids.pop();
    const highestBidderAmount = pendingReturns.getSome(highestBidderAddress);
    const to_beneficiary = ContractPromiseBatch.create(/*STEP 2*/);
    to_beneficiary.transfer(/*STEP 3*/);
    distributeFunds(auctionId);
    return true;
}
```
Take a breath, we are marching forward!
## After the auction - distributing funds
The function we are going to write is not really complicated, it takes an auction id, fetches the auction, ditributes funds to participants, and marks auction.bidsDistributed as true.
STEP 1 : prepare for sending funds to the bidder
STEP 2 : pass the amount tp be sent as a parameter to transfer()
STEP 3 : now that bids are distributed, make sure to mark the correspondent field as true.
```ts
export function distributeFunds(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    while(bids.length !=0) {
        let bidder = bids.pop();
        let bidAmount = pendingReturns.getSome(bidder);
        const to_beneficiary = ContractPromiseBatch.create(/*STEP 1*/);
        to_beneficiary.transfer(/*STEP 2*/);
    }
    if(bids.length == 0){
        auction.bidsDistributed = /*STEP 3*/;
        auctions.set(auctionId, auction);
        return true;
    }
    else {
        return false;
    }   
}
```
Almost there!
## writing a helper function - getBids
We may need to get a list of bidders, lets write a getter:
STEP 1 : pass the appropriate parameters for set(), give it a moment of thinking, you need a {key:value} pair of {String:u128}.
STEP 2 : return the temporary collection
```ts
export function getBids(): Map<string, u128> {
  let tempBidsMap = new Map<string, u128>();
  if(bids.length != 0){
    for(let i =0; i< bids.length; i++){
        let bidAmount = pendingReturns.getSome(bids[i]);
        tempBidsMap.set(/*STEP 1*/)
    }
  }
  return /*STEP 2*/;
}
```
And we are done! now you have one more cool thing about you, you know how to write NEAR contracts!
