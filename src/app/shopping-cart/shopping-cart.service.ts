import { Injectable, Inject } from "@angular/core";
import { ITicketDiscount } from "../tickets/model/ticket-discount.model"

import { ITicketModel } from "../tickets/model/ticket.model";

import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';

import { ErrorHandler } from '../common/service/error-handler.service';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export interface ICheckoutType
{
    name: string;
    pay(totalPrice:number): string;
}

export interface ICheckout
{
    checkOut(totalPrice:number):string;
}

@Injectable()
export class ShoppingCartService implements ICheckout {
    private _checkOutType: ICheckoutType 	= null;
	private _discount: ITicketDiscount 		= null;
	
	constructor(@Inject('APP_CONFIG') private config, @Inject(ErrorHandler) private errorHandler, private http: Http) {}
	
    set checkOutType(value: ICheckoutType) {
        this._checkOutType = value;
    }
	
	set discount(value: ITicketDiscount) {
        this._discount = value;
    }
	
    public checkOut(totalPrice:number) : string {
        return this._checkOutType ? this._checkOutType.pay(totalPrice) : "Please select method of payment";
    }
	
	public getTickets() : Promise<ITicketModel[]> {
		const url = `${this.config.apiUrl}/ticket`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: ITicketModel[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public getTicket(ticketId: number) : Promise<ITicketModel> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		
		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: ITicketModel) =>
				{
					resolve(data);
				});
		});
	}
	
	public addTicket(params: any) : Promise<string> {
		let body = JSON.stringify(params);

		const url = `${this.config.apiUrl}/ticket/`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.post(url, body, options)
				.map((res: Response) => res.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
	
	public updateTicket(params: any, ticketId: number) : Promise<string> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		
		let body = JSON.stringify(params);

		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.put(url, body, options)
				.map((res: Response) => res.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
	
	public removeTicket(ticketId: number) : Promise<string> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		
		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.delete(url, options)
				.map((res: Response) => res.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
	
	private getHeaders(data?: any) : RequestOptions {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		
		let params = new URLSearchParams();
		for(let key in data) {
			params.set(key, data[key]);
		}
		return new RequestOptions({ headers: headers, search: params });
	}
}