export interface IMenuItem
{
    id: 		number;
	label: 		string;
	icon?: 		string;
	path?: 	 	string;
	visible?:	boolean;
	disabled?: 	boolean;
}

export class MenuItem implements IMenuItem
{
	constructor(
		public id: number,
		public label: string,
		public icon: string 		= '',
		public path: string 		= '',
		public visible: boolean 	= true,
		public disabled: boolean 	= false,
	) {}
	
	public toString() : string {
		return `MenuItem with ID=${this.id} and label=${this.label}`;
	}
}