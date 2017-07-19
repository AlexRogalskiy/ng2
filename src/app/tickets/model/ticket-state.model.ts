import { ITicketModel } from './ticket.model';
import { ITicketUserInfo } from './ticket-user-info.model';

export interface ITicketState
{
    tickets: 		Array<ITicketModel>;
	userInfo?:		ITicketUserInfo;
	//totalPrice: 	number;
	//totalAmount: 	number;
}

export class TicketState implements ITicketState
{
	constructor(
		public tickets: Array<ITicketModel> = null,
		public userInfo: ITicketUserInfo = null
	) {}
	
	public toString() : string {
		return `TicketState with tickets=${this.tickets} and userInfo=${this.userInfo}`;
	}
}