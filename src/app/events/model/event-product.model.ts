export interface IEventProductModel
{
	//id: 			number;
    //eventId: 		number;
	//contentUid: 	string;
	productId: 		number;
    name: 			string;
    startTime: 		string;
    endTime: 		string;
}

export class EventProductModel implements IEventProductModel
{
	constructor(
		//public id: number,
		//public eventId: number,
		//public contentUid: string,
		public productId: number,
		public name: string,
		public startTime: string,
		public endTime: string
	) {}
		
	public toString() : string {
		return `EventProductModel with ID=${this.productId} and name=${this.name}`;
	}
}