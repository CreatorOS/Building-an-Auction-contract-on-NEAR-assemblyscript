import { createAuction, bid, distributeFunds } from "../assembly";
import {VMContext} from "near-sdk-as";
describe("distributeFunds", () => {
  it("distributes funds", () => {
    VMContext.setSigner_account_id(process.env.get("user1"));
    const auction = createAuction(1000);
    //We bid first because distributeFunds uses the bids collection
    bid(auction);
    const distributed = distributeFunds(auction);
    expect(distributed).toBeTruthy();
  })
})