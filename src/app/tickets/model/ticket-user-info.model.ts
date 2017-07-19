export interface ITicketUserInfo
{
    firstName: 	string;
    lastName: 	string;
}

export class TicketUserInfo implements ITicketUserInfo
{	
	constructor(
		public firstName: string = '',
		public lastName: string = ''
	) {}
	
	public toString() : string {
		return `TicketUserInfo with FirstName=${this.firstName} and Last Name=${this.lastName}`;
	}
}