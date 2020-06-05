import { FulfillOrderHandler } from "./handlers/fulfillOrderHandler";
import { PurchaseCompletedHandler } from "./handlers/purchaseCompletedHandler";
import { PurchaseFailedHandler } from "./handlers/purchaseFailedHandler";


async function main(): Promise<void> {
    try {
        var fullfillOrderhandler = new FulfillOrderHandler();
        var purchaseCompletedHandler = new PurchaseCompletedHandler();
        var purchaseFailedHandler = new PurchaseFailedHandler();

        await Promise.all(
            [
                fullfillOrderhandler.StartHandling(), 
                purchaseCompletedHandler.StartHandling(),
                purchaseFailedHandler.StartHandling()

        ]);
    } finally {
     // await sbClient.close();
    }
  }


main().catch((err) => {
    console.log("Error occurred: ", err);
});