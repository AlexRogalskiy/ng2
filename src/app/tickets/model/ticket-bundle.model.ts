export interface ITicketBundle
{
	id: 		number;
	limit: 		number;
	price: 		number;
	eventId: 	number;
	tariff:		string;
	exist?: 	number;
}

export class TicketBundle implements ITicketBundle
{
	constructor(
		public id:		number,
		public limit: 	number,
		public price: 	number,
		public eventId:	number,
		public tariff:	string,
		public exist?: 	number
	) {}
	
	public toString() : string {
		return `TicketBundle with ID=${this.id}, eventID=${this.eventId}, price=${this.price}, limit=${this.limit}, tariff=${this.tariff}`;
	}
}