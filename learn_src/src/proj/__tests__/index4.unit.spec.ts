import { createAuction, bid, distributeFunds } from "../assembly";
describe("distributeFunds", () => {
  it("distributes funds", () => {
    const auction = createAuction(1000);
    //We bid first because distributeFunds uses the bids collection
    bid(auction);
    const distributed = distributeFunds(auction);
    expect(distributed).toBeTruthy();
  })
})