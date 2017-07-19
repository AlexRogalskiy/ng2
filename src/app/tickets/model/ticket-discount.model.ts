export interface ITicketDiscount
{
    code: 		string;
	name?:		string;
	value: 		number;
}

export class TicketDiscount implements ITicketDiscount
{
	constructor(
		public code: string,
		public name: string = '',
		public value: number
	) {}
	
	public toString() : string {
		return `TicketDiscount with code=${this.code}, name=${this.name} and value=${this.value}`;
	}
}