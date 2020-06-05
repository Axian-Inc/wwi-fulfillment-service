export class FulfillOrderCommand {
  public orderId:string;
  public productIds:string[];
  public orderDate:Date;
  public shipName:string;
  public shipStreet:string;
  public shipCity:string;
  public shipState:string;
  public shipPostalCode:string;
}