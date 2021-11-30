import * as contract from "../assembly";
import { VMContext } from "near-sdk-as";
import { TO_BE_SENT_FUNDS } from "../../utils";

describe("Auction contract", () => {
  it("creates an auction", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const auction = contract.createAuction(10);
    expect(auction).toBeTruthy();
  })

  it("allows users to bid", () => {
    VMContext.setSigner_account_id("alice.testnet");
    VMContext.setAttached_deposit(TO_BE_SENT_FUNDS);
    const auction = contract.createAuction(1000);
    const op = contract.bid(auction);
    expect(op).toBeTruthy();
  })

  it("ends an auction", () => {
    VMContext.setSigner_account_id("alice.testnet");
    //We bid first because auctionEnd uses the bids collection
    const auction = contract.createAuction(1000);
    contract.bid(auction);
    const ended = contract.auctionEnd(auction);
    expect(ended).toBeTruthy();
  })

  it("distributes funds", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const auction = contract.createAuction(1000);
    //We bid first because distributeFunds uses the bids collection
    contract.bid(auction);
    const distributed = contract.distributeFunds(auction);
    expect(distributed).toBeTruthy();
  })

  it("stores and returns bids", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const auction = contract.createAuction(1000);
    contract.bid(auction);
    const bids = contract.getBids();
    expect(bids.size).toBe(1);
  })
})
