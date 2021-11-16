import { createAuction } from "../assembly";
describe("createAuction",()=>{
    it("creates an auction", () => {
        const auction = createAuction(10);
        expect(auction).toBeTruthy();
      })
})