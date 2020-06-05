import { ServiceBusClient, ReceiveMode } from "@azure/service-bus";
import { FulfillOrderCommand } from "../models/FulfillOrderCommand";
import { isNullOrUndefined } from "util";

export class FulfillOrderHandler {

    // Define connection string and related Service Bus entity names here
    private namingSuffix = '-mrj';
    private pollIntervalSec = 15;
    private connectionString: string = "Endpoint=sb://ffthh-unify-services.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=PiEdkmTpw6pT/y885ZJ9FpXmQR7UbllEF/xoZq9JZJA=";   
    private queueName = `fulfillment${this.namingSuffix}`;
    private sbClient: ServiceBusClient;

    public async StartHandling(): Promise<void> {
        this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString);
        const queueClient = this.sbClient.createQueueClient(this.queueName);
        console.log(`Creating queue receiver for ${this.queueName} ...`);
        const receiver = queueClient.createReceiver(ReceiveMode.receiveAndDelete);

        while(true) {
            console.log(`Waiting ${this.pollIntervalSec} seconds for command messages from the queue '${this.queueName}' ...`);
            const messages = await receiver.receiveMessages(1, this.pollIntervalSec);
            if(messages.length == 0) {
                continue;
            } else {
                console.log(`Received ${messages.length} message from the queue '${this.queueName}'`);
            }
            
            for (var i = 0; i < messages.length; i++) {
                const message = messages[i];
                const fullfillOrderCommand: FulfillOrderCommand = message.body;
                if (isNullOrUndefined(fullfillOrderCommand.productIds) || fullfillOrderCommand.productIds.length == 0) {
                    console.error(
                        "No products were specified for fullfilment",
                        fullfillOrderCommand
                    );
                    // Deadletter the message received
                    await message.deadLetter({
                        deadletterReason: "NoProductsSpecified",
                        deadLetterErrorDescription: "One or more product IDs are required to fulfill an order."
                    });
                } else {
                    console.log(`Successfully fulfilled order ${message}`)
                }
            }
        }
        await queueClient.close();
    }

    private async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}