export interface IEventMediaModel {
    content: 			string;
    contentInternal: 	string;
}

export class EventMediaModel implements IEventMediaModel {
	
	constructor(
		public content: string = '',
		public contentInternal: string = ''
	) {}
	
	public toString() : string {
		return `EventMediaModel with content=${this.content} and contentInternal=${this.contentInternal}`;
	}
}