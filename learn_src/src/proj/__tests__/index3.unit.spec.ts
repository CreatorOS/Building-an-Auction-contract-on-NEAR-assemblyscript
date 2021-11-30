import { createAuction, bid, auctionEnd } from "../assembly";
import {VMContext} from "near-sdk-as";
describe("auctionEnd", () => {
  it("ends an auction", () => {
    VMContext.setSigner_account_id("alice.testnet");
    //We bid first because auctionEnd uses the bids collection
    const auction = createAuction(1000);
    bid(auction);
    const ended = auctionEnd(auction);
    expect(ended).toBeTruthy();
  })

})