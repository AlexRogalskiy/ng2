export interface IIconModel
{
    label: string,
	path: string
}

export class IconModel implements IIconModel {
	constructor(
		public label: string,
		public path: string,
	) {}
	
	public toString() : string {
		return `IconModel with label=${this.label} and path=${this.path}`;
	}
}