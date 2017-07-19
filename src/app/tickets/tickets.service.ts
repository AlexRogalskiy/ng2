/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Injectable, Inject } from "@angular/core";

import { ITicketModel } from "./model/ticket.model";
import { ITicketBundle } from "./model/ticket-bundle.model";
import { ITicketCouponBundle } from "./model/ticket-coupon-bundle.model";

import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';

import { ErrorHandler } from '../common/service/error-handler.service';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TicketsService {
	
	constructor(@Inject('APP_CONFIG') private config, @Inject(ErrorHandler) private errorHandler, private http: Http) {}

	public getAvailableTickets(eventId: number) : Promise<ITicketBundle[]> {
		if (isNaN(eventId) || !Number.isInteger(eventId)) return Promise.resolve(null);
		
		const url = `${this.config.apiUrl}/${eventId}/ticket/bundle`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: ITicketBundle[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public getAvailableCoupons(eventId: number) : Promise<ITicketCouponBundle[]> {
		if (isNaN(eventId) || !Number.isInteger(eventId)) return Promise.resolve(null);
		
		const url = `${this.config.apiUrl}/${eventId}/coupon/bundle`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: ITicketCouponBundle[]) =>
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