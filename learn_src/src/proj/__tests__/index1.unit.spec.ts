import { createAuction } from "../assembly";
import {VMContext} from "near-sdk-as";
describe("createAuction", () => {
  it("creates an auction", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const auction = createAuction(10);
    expect(auction).toBeTruthy();
  })
})