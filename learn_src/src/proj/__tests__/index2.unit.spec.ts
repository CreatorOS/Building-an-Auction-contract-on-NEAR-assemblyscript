import { createAuction, bid } from "../assembly";
import { VMContext } from "near-sdk-as";
import { TO_BE_SENT_FUNDS } from "../../utils";
describe("bid", () => {
  it("allows users to bid", () => {
    VMContext.setAttached_deposit(TO_BE_SENT_FUNDS);
    const auction = createAuction(1000);
    const op = bid(auction);
    expect(op).toBeTruthy();
  })
})