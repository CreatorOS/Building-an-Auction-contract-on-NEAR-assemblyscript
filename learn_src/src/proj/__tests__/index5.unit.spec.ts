import { createAuction, bid, getBids } from "../assembly";
import {VMContext} from "near-sdk-as";
describe("getBids", () => {
  it("stores and returns bids", () => {
    VMContext.setSigner_account_id(process.env.get("user1"));
    const auction = createAuction(1000);
    bid(auction);
    const bids = getBids();
    expect(bids.size).toBe(1);
  })
})