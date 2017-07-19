import { ITicketDiscount } from './ticket-discount.model';
import { IEventProductModel } from '../../events/model/event-product.model';
import { ITicketCouponBundle } from './ticket-coupon-bundle.model';

export interface ITicketModel
{
	//id: 			number;
	//eventId:		number;
    //price: 			number;
	label: 			string;
    amount?: 		number;
	totalPrice?: 	number;
	//startTime?:		Date;
	//endTime?:		Date;
	discount?:		ITicketDiscount;
	//limit?:			number;
	eventName?:		string;
	eventInfo:		IEventProductModel;
	couponInfo:		ITicketCouponBundle;
}

export class TicketModel implements ITicketModel
{
	constructor(
//		public id: number,
//		public eventId: number,
		public label: string,
		public amount: number,
//		public price: number,
		public totalPrice: number,
//		public startTime: Date = null,
//		public endTime: Date = null,
		public discount: ITicketDiscount = null,
//		public limit: number = null,
		public eventName: string = null,
		public eventInfo: IEventProductModel = null,
		public couponInfo: ITicketCouponBundle = null,
	) {}
	
	public toString() : string {
		return `TicketModel with label=${this.label}, amount=${this.amount}, totalPrice=${this.totalPrice}`;
	}
}