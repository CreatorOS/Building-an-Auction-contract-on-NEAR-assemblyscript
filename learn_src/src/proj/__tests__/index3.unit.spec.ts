import { createAuction, bid, auctionEnd } from "../assembly";
describe("auctionEnd",()=>{
    it("ends an auction",()=>{
        //We bid first because auctionEnd uses the bids collection
        const auction = createAuction(1000);
        bid(auction);
        const ended = auctionEnd(auction);
        expect(ended).toBeTruthy();
      })
    
    })