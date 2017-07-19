import { IEventProductModel } from './event-product.model';
import { IEventMediaModel, EventMediaModel } from './event-media.model';
import { ITicketBundle } from '../../tickets/model/ticket-bundle.model';
import { ITicketCouponBundle } from '../../tickets/model/ticket-coupon-bundle.model';

export interface IEventModel
{
	//id: 			number;
	eventId?:		number;
	name: 			string;
	//contentUid: 	string;
	startTime: 		string;
	endTime: 		string;

	products?: 		Array<IEventProductModel>;
	avatar?:		IEventMediaModel;
	posters?: 		Array<IEventMediaModel>;
	tickets?: 		Array<ITicketBundle>;
	coupons?: 		Array<ITicketCouponBundle>;
}

export class EventModel implements IEventModel {
	//public id: 				number;
	public eventId?:		number;
	public name:			string;
	//public contentUid:		string;
	public startTime:		string;
	public endTime:			string;
	
	public products?:		Array<IEventProductModel> = [];
	public avatar?:        	IEventMediaModel = 	new EventMediaModel();
	public posters?:		Array<IEventMediaModel> = [];
	public tickets?: 		Array<ITicketBundle> = [];
	public coupons?: 		Array<ITicketCouponBundle> = [];
	
	private _title?: 		string = null;
	private _subTitle?: 	string = null;
	private _content?: 		string = null;
	private _hide?: 		boolean = false;

	constructor() {}

	public toggle() : void {
		this._hide = !this._hide;
	}
	
	public get title() : string {
		return this._title;
	}
	
	public set title(title: string) {
		this._title = title;
	}
	
	public get subTitle() : string {
		return this._subTitle;
	}
	
	public set subTitle(subTitle: string) {
		this._subTitle = subTitle;
	}
	
	public get content() : string {
		return this._content;
	}
	
	public set content(content: string) {
		this._content = content;
	}
	
	public toString() : string {
		return `EventModel with ID=${this.eventId} and event name=${this.name}`;
	}
	 
	public _clone(object: EventModel) {
		return JSON.parse(JSON.stringify( object ));
	}
}

