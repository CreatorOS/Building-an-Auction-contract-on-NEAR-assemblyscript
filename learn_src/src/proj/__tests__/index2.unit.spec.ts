import { createAuction, bid } from "../assembly";
describe("bid",()=>{
    it("allows users to bid",()=>{
        const auction = createAuction(1000);
        const op = bid(auction);
        expect(op).toBeTruthy();
      })
    })