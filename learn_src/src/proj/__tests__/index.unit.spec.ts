import * as contract from "../assembly";
import {context, u128, VMContext} from "near-sdk-as";
import {ONE_NEAR, TO_BE_SENT_FUNDS} from "../../utils";

describe("Auction contract", () => {
  beforeEach(() => {
    VMContext.setAttached_deposit(TO_BE_SENT_FUNDS);
  })
  it("creates an auction", () => {
    const auction = contract.createAuction(10);
    expect(auction).toBeTruthy();
  })

  it("allows users to bid",()=>{
    const auction = contract.createAuction(1000);
    const op = contract.bid(auction);
    expect(op).toBeTruthy();
  })
  
  it("ends an auction",()=>{
    //We bid first because auctionEnd uses the bids collection
    const auction = contract.createAuction(1000);
    contract.bid(auction);
    const ended = contract.auctionEnd(auction);
    expect(ended).toBeTruthy();
  })

  it("distributes funds",()=>{
    const auction = contract.createAuction(1000);
    //We bid first because distributeFunds uses the bids collection
    contract.bid(auction);
    const distributed = contract.distributeFunds(auction);
    expect(distributed).toBeTruthy();
  })

  it("stores and returns bids",()=>{
    const auction = contract.createAuction(1000);
    contract.bid(auction);
    const bids = contract.getBids(); 
    expect(bids.size).toBe(1);
  })
})
