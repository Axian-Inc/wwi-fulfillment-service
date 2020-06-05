import { ServiceBusClient, ReceiveMode } from "@azure/service-bus";
import { FulfillOrderCommand } from "../models/FulfillOrderCommand";
import { isNullOrUndefined } from "util";

export class PurchaseCompletedHandler {

    // Define connection string and related Service Bus entity names here
    private namingSuffix = '-mrj';
    private pollIntervalSec =15;
    private connectionString: string = "Endpoint=sb://ffthh-unify-services.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=PiEdkmTpw6pT/y885ZJ9FpXmQR7UbllEF/xoZq9JZJA=";
    private topicName = `purchasecompleted${this.namingSuffix}`;
    private sbClient: ServiceBusClient;

    public async StartHandling(): Promise<void> {
        this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString);
        const subscriptionClient = this.sbClient.createSubscriptionClient(this.topicName, "AllMessages");
        const receiver = subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete);

        while(true) {
            console.log(`Waiting ${this.pollIntervalSec} seconds for event messages from the topic '${this.topicName}' ...`);
            const messages = await receiver.receiveMessages(10, this.pollIntervalSec);
            if(messages.length == 0) {
                continue;
            } else {
                console.log(`Received ${messages.length} message from the topic '${this.topicName}'`);
            }

            for (let i = 0; i < messages.length; i++) {
                console.log(messages[i].body);
            }
        }

        await receiver.close();
    }

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}