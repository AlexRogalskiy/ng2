/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Injectable, Inject } from "@angular/core";

import { IEventModel } from "./model/event.model";
import { ITicketBundle } from "../tickets/model/ticket-bundle.model";

import { TicketsService } from "../tickets/tickets.service";
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';

import { ErrorHandler } from '../common/service/error-handler.service';

import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EventsService {
    
	private perpage: number = 50;
	private start: number 	= 10;
	
	constructor(@Inject('APP_CONFIG') private config, @Inject(TicketsService) private ticketsService, @Inject(ErrorHandler) private errorHandler, private http: Http) {}
	
	public loadEvents(start: number = 0) : Promise<IEventModel[]> {
		if (isNaN(start) || !Number.isInteger(start) ) return Promise.resolve([]);
		
		const url = `${this.config.apiUrl}`;		
		let options = this.getHeaders(
		{
			'filter[limit]': this.perpage.toString(),
			'filter[skip]': this.start.toString()
		});
		
		return new Promise(resolve =>
		{
		  this.http.get(url, options)
			.map((response: Response) => response.json())
			.catch((error: Response) => this.errorHandler.handleError(error))
			.subscribe((data: IEventModel[]) =>
			{
				resolve(data);
			});
		});
	}
	
	public loadInfinite(infiniteScroll: any) : void {
		console.log('doInfinite, start is currently ' + this.start);
		this.start += 10;
		this.loadEvents().then(() =>
		{
			infiniteScroll.complete();
		});
	}
	
	public getEventByID(eventId: number) : Promise<IEventModel> {
		if (isNaN(eventId) || !Number.isInteger(eventId)) return Promise.resolve(null);
		
		const url = `${this.config.apiUrl}/${eventId}`;
		let options = this.getHeaders();
		
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: IEventModel) =>
				{
					resolve(data);
				});
		});
	}
  
	public getEvents() : Promise<IEventModel[]> {
		const url = `${this.config.apiUrl}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.map((item: IEventModel[]) => item.filter((_item: IEventModel) => _item.name)) // Remove events with no name
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: IEventModel[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public searchEventsByName(term: string) : Promise<IEventModel[]> {
		if(!term || 0 === term.trim().length) return this.getEvents();

		const url = `${this.config.apiUrl}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.map((item : IEventModel[]) =>
				{
					return item.filter((_item: IEventModel) =>
					{
						return (_item.name.toLowerCase().indexOf(term.toLowerCase()) > -1);
					});
				})
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: IEventModel[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public searchEventsByDateRange(startDate: string, endDate: string = null) : Promise<IEventModel[]> {
		let dateStart = Date.parse(startDate);
		let dateEnd = Date.parse(endDate);

		if(isNaN(dateStart) && isNaN(dateEnd)) return this.getEvents();
		if(!isNaN(dateEnd) && !isNaN(dateStart) && dateStart >= dateEnd) return Promise.resolve([]);

		const url = `${this.config.apiUrl}`;
		let options = this.getHeaders();

		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.map((item: IEventModel[]) =>
				{
					return item.filter(_item =>
					{
						return (!isNaN(dateStart) ? Date.parse(_item.startTime) >= dateStart : true && (!isNaN(dateEnd) ? Date.parse(_item.startTime) <= dateEnd : true))
					});
				})
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: IEventModel[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public searchEventsByTariffGroup(tariffs: string[]) : Promise<IEventModel[]> {
		const url = `${this.config.apiUrl}`;
		let options = this.getHeaders();
				
		let pBundle: Promise<Array<ITicketBundle>> 	= null;
		let filteredEvents: Array<IEventModel> 	= [];
		
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.map((item: IEventModel[]) => item.map((entity: IEventModel) =>
				{
					this.ticketsService.getAvailableTickets(entity.eventId).then((tb: ITicketBundle[]) =>
					{
						tb && tb.some((_tb: ITicketBundle) =>
						{
							if(-1 != tariffs.indexOf(_tb.tariff)) {
								filteredEvents.push(entity);
								return true;
							}
						});
					})
				}))
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: Promise<void>[]) =>
				{
					resolve(filteredEvents);
				});
		});
	}
	
	public searchEventsByPriceRange(startPrice: number, endPrice: number) : Promise<IEventModel[]> {
		if((isNaN(startPrice) || !Number.isInteger(startPrice)) || (isNaN(endPrice) || !Number.isInteger(endPrice))) return Promise.resolve([]);
		if(startPrice >= endPrice) return Promise.resolve([]);
		
		const url = `${this.config.apiUrl}`;
		let options = this.getHeaders();
				
		let pBundle: Promise<Array<ITicketBundle>> 	= null;
		let filteredEvents: Array<IEventModel> 	= [];
		
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				.map((item: IEventModel[]) => item.map((entity: IEventModel) =>
				{
					this.ticketsService.getAvailableTickets(entity.eventId).then((tb: ITicketBundle[]) =>
					{
						tb && tb.some((_tb: ITicketBundle) =>
						{
							if(_tb.price <= endPrice && _tb.price >= startPrice) {
								filteredEvents.push(entity);
								return true;
							}
						});
					})
				}))
				.catch((error: Response) => this.errorHandler.handleError(error))
				.subscribe((data: Promise<void>[]) =>
				{
					resolve(filteredEvents);
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