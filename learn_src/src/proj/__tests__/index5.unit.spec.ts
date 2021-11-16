import { createAuction, bid, getBids } from "../assembly";
describe("getBids", () => {
  it("stores and returns bids", () => {
    const auction = createAuction(1000);
    bid(auction);
    const bids = getBids();
    expect(bids.size).toBe(1);
  })
})