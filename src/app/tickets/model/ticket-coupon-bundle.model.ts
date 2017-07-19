export interface ITicketCouponBundle
{
	couponPresetId: number;
	limit:	 		number;
	price: 			number;
	productId: 		number;
}

export class TicketCouponBundle implements ITicketCouponBundle
{
	constructor(
		public couponPresetId:	number,
		public limit: 			number,
		public price: 			number,
		public productId:		number
	) {}
	
	public toString() : string {
		return `TicketCouponBundle with ID=${this.couponPresetId}, productId=${this.productId}, price=${this.price}, limit=${this.limit}`;
	}
}