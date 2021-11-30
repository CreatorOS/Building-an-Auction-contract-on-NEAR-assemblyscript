# Building an Auction contract on NEAR
**Why decentralized auctions?**
Be it NFTs or Fungible Tokens,decentralized auctions give everyone a fair chance to participate in the auction as well as the process of the entire auction can be made transparent and trustworthy. Decentralized auctions act as a great tool for creators who want to discover the price of the selling goods/services in a fair manner.
In this quest, we will learn how to build an auction smart contract on NEAR using AssemblyScript. 

## What does this contract do?
This contract will allow 
- Users to create auctions,
- place bids
- Admins to end auctions and 
- Distribute funds. 
 
The contract is fairly easy to understand, with no overcomplications. Let's get right to it!

## Writing the SimpleAuction class fields
First, we need to create a class that will be the base stone for the contract's state. You see the basic utilities being imported from NEAR's AssemblyScript SDK. This would be the first line of your code file.

```ts
import { context, u128, PersistentMap, PersistentVector, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
```

Now, take a look at the class below called "SimpleAuction". This would be our main class consisting of all the variables. 
We will write the constructor body in the upcoming step.


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
- biddingTime: the "expiration period" of the auction. Your job is to fill in the missing code snippets with the help of the steps described below.


You have to initialize state fields like the following:

STEP 1 : Initialize id with the random value generated (roll).

STEP 2 : nitialize the state field "beneficiary" with the benificiaryAccount parameter.

STEP 3 : Initialize auctionEndTime with the sum of biddingTime and current date.

STEP 4 : Initialize the state field "ended" with false.

STEP 5 : Initialize the highestBid field with zero. You can do it using u128.Zero (from the imports at the beginning).

STEP 6 : Initiliaze bidsDistributed with false. 

```ts
constructor(beneficiaryAccount: string, biddingTime: u32) {
        /*
        Generates a random number for the id.
        */
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        const currentDate = Date.now();
        this.id = /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 1)*/;
        /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 2)*/;
        /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 3)*/;
        /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 4)*/;
        /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 5)*/;
        /*FILL IN THE MISSING CODE SNIPPET HERE(STEP 6)*/;
    }
```
Cool! SimpleAuction class is ready now, let's continue on.

## Starting with functionality - creating an auction
In this part of this step, we will write a function that creates an auction. But before this, let's create some helpful data structures:

```ts
//Create a persistentMap to store auctions and auctionIDs
export const auctions = new PersistentMap<u32, SimpleAuction>("a");
//Create a persistentMap to store the account and their bid
export const pendingReturns = new PersistentMap<string, u128>("p");
//Create a persistentVector to store all the bid accounts(in sorted order)
export const bids = new PersistentVector<string>("b");
```

These data structures will help us store and retrieve all the data we need.
Now, let's go straight to the createAuction function. You will have to add the missing code pieces in order to complete the functionality according tot he steps mentioned. 
You have to write two things here:
Look at the parameter list for the SimpleAuction constructor, as mentioned previously, there are two of them. The first one (beneficiaryAccount) should be set to context.sender (the caller's NEAR account id) and the second one (biddingTime) is provided as a createAuction() parameter.

STEP 1 : Pass the appropriate values as parameters.

STEP 2 : Return the id, the same one used in createAuction in the second line.  
```ts
export function createAuction(biddingTime: u32) : u32 {
    const auction = new SimpleAuction(/* FILL IN THE MISSING CODE SNIPPET (STEP 1)*/);
    auctions.set(auction.id,auction);
    /*FILL IN THE MISSING CODE SNIPPET (STEP 2)*/;
}
```
Great, ready to go further?

## Moving on to bidding
Now to the real deal, we will write our bidding function. This function receives a 32-bit unsigned integer and returns a boolean. You have a couple of things to do here, but all that you are going to write in this section is associated with context.sender, or context.attachedDeposit. Remember those? 
They are the caller's account id and funds sent, respectively. 

STEP 1 : Check if the funds are sufficient to bid.

STEP 2 : This set() function takes two parameters, check pendingReturns key:value pair, and write these parameters.

STEP 3 : Set this auction's highest bid.

STEP 4 : Set the highest bidder.

STEP 5 : Store the caller's id in bids.  

```ts
export function bid(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    const currentDate = Date.now();
    if(currentDate > auction.auctionEndTime){
        return false;
    }
    if(/* FILL IN THE MISSING CODE SNIPPET (STEP 1)*/ < auction.highestBid) {
        return false;
    }
    if (auction.ended){
        return false;
    }
    pendingReturns.set(/*FILL IN THE MISSING CODE SNIPPET (STEP 2)*/);
    auction.highestBid = /*FILL IN THE MISSING CODE SNIPPET (STEP 3)*/;
    auction.highestBidder = /*FILL IN THE MISSING CODE SNIPPET (STEP 4)*/;
    bids.push(/*FILL IN THE MISSING CODE SNIPPET (STEP 5)*/;
    auctions.set(auction.id, auction);  
    return true;
}
```

Now that we have written the main functionality of this contract, let's build on it to complete the auction!

## After the auction - Ending the auction properly
Now we will write a function that ends the auction. Tt marks the auction as ended, sends the highest bid to the seller, and refunds the rest of the bdis to the other participants. This refund happens in distributeFunds() function, which we will write it in the next section.
Fill in the missing code snippets to complete the functionality with the help of the steps mentioned below.

STEP 1 : Mark the auction as ended.

STEP 2 : Prepare to send funds to the auction's beneficiary, pass the latter as a parameter, the only parameter to ContractPromiseBatch.create().

STEP 3 : Transfer the highest bidder amount to the beneficiary. 

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
    auction.ended = /*FILL IN THE MISSING CODE SNIPPET(STEP 1)*/;
    logging.log("Auction has ended now!");
    const highestBidderAddress = bids.pop();
    const highestBidderAmount = pendingReturns.getSome(highestBidderAddress);
    const to_beneficiary = ContractPromiseBatch.create(/*FILL IN THE MISSING CODE SNIPPET (STEP 2)*/);
    to_beneficiary.transfer(/*FILL IN THE MISSING CODE SNIPPET (STEP 3)*/);
    distributeFunds(auctionId);
    return true;
}
```

Take a breath, we are marching forward!

## After the auction - distributing funds
The function we are going to write is not really complicated. It takes an auction id, fetches the auction, distributes funds to participants, and marks auction.bidsDistributed as true. This helps us understand that an auction has completed all the steps that it was meant to.
Fill in the missing code snippets to complete the functionality with the help of the steps mentioned below.

STEP 1 : Prepare for sending funds to the bidder.

STEP 2 : Pass the amount(the bid by each bidder) to be sent as a parameter to the transfer() function.

STEP 3 : Now that the bids are distributed, make sure to mark the corresponding field as true.

```ts
export function distributeFunds(auctionId: u32): boolean {
    const auction = auctions.getSome(auctionId);
    while(bids.length !=0) {
        let bidder = bids.pop();
        let bidAmount = pendingReturns.getSome(bidder);
        const to_beneficiary = ContractPromiseBatch.create(/*FILL IN THE MISSING CODE SNIPPET (STEP 1)*/);
        to_beneficiary.transfer(/*FILL IN THE MISSING CODE SNIPPET (STEP 2)*/);
    }
    if(bids.length == 0){
        auction.bidsDistributed = /*FILL IN THE MISSING CODE SNIPPET (STEP 3)*/;
        auctions.set(auctionId, auction);
        return true;
    }
    else {
        return false;
    }   
}
```
We have completed most part of our contract, but we still need to setup some getter functions to get data from the contract.
We are almost there!

## Writing a helper function - getBids
We may need to get a list of bidders, lets write a getter method for that.
Fill in the missing code snippets to complete the functionality with the help of the steps mentioned below.

STEP 1 : Pass the appropriate parameters for set(), give it a moment of thinking, you need a {key:value} pair of {String:u128}.

STEP 2 : Return the temporary collection

```ts
export function getBids(): Map<string, u128> {
  let tempBidsMap = new Map<string, u128>();
  if(bids.length != 0){
    for(let i =0; i< bids.length; i++){
        let bidAmount = pendingReturns.getSome(bids[i]);
        tempBidsMap.set(/*FILL IN THE MISSING CODE SNIPPET (STEP 1)*/)
    }
  }
  return /*FILL IN THE MISSING CODE SNIPPET (STEP 2)*/;
}
```
And we are done! Now you have one more cool thing about you, you know how to write NEAR contracts! You can use this contract to build your own auction based Dapps on NEAR. Let us know what you would like to build by giving us a shoutout on twitter @questbook.
