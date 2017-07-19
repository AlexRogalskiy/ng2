import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { EventsService } from '../events.service';
import { IEventModel, EventModel } from '../model/event.model';
import { IEventProductModel, EventProductModel } from '../model/event-product.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ITicketBundle } from '../../tickets/model/ticket-bundle.model';
import { ITicketModel, TicketModel } from '../../tickets/model/ticket.model';
import { TicketStorage } from '../../tickets/model/ticket-storage.component';
import { DomSanitizer } from '@angular/platform-browser';
//import { ErrorHandler } from '../../error-handler.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Created by pavel.antoshenko on 1/30/2017.
 */
@Component(
{
	selector: 'event',
	styleUrls: ['./event.component.css'],
	templateUrl: './event.component.html'
})

export class Event implements OnInit, OnDestroy {
	
	private eventUpdatedLabel: string 				= "Обновлено:";
	private eventNameLabel: string 					= "Мероприятие:";
	private eventStartDateLabel: string 			= "Дата начала:";
	private eventEndDateLabel: string 				= "Дата окончания:";
	private eventPhoneLabel: string 				= "111-222-3333";
	private eventEmailLabel: string 				= "kassir@example.com";
	
	private eventAboutLabel: string 				= "Информация о мероприятии:";
	private eventOrgLabel: string 					= "Данные об организаторе:";
	private eventServicesLabel: string 				= "Ключевые события:";
	private eventTariffLabel: string 				= "Тарифы:";
	private eventRatingLabel: string 				= "Отзывы:";
	private eventAverageRatingLabel: string 		= "Средний рейтинг";
	private eventPositionRatingLabel: string 		= "Позиции рейтинга";
	
	private eventNameTableLabel: string 			= "Событие";
	private eventStartDateTableLabel: string 		= "Дата начала";
	private eventEndDateTableLabel: string 			= "Дата окончания";
	private eventTicketNumberTableLabel: string 	= "Количество";
	private eventPriceTableLabel: string 			= "Стоимость";
	private eventNotFoundLabel: string 				= "Нет доступных событий";
	
	private tariffs: Array<any> =
	[
		{type: 'Взрослый', 		scale: '80%', style: {'width': '80%'}},
		{type: 'Студенческий', 	scale: '70%', style: {'width': '70%'}},
		{type: 'Школьный', 		scale: '70%', style: {'width': '70%'}},
		{type: 'Детский', 		scale: '65%', style: {'width': '65%'}},
	];
	
	private scales: Array<any> = 
	[
		{price: 1000, 	style: {'meter': true, 'meter-left': true}},
		{price: 2000, 	style: {'meter': true, 'meter-left': true}},
		{price: 10000, 	style: {'meter': true, 'meter-right': true}},
		{price: 7000, 	style: {'meter': true, 'meter-right': true}}
	];
	
	private id: 			number;
	//private items: 		Array<ITicketModel> = [];
	private items: 			Observable<Array<ITicketModel>> = null;
	private ticketsEntity: 	Array<ITicketModel> = [];
	public tickets: 		BehaviorSubject<Array<ITicketModel>> = null;
	
	private eventEntity: 	IEventModel = new EventModel();
	private addToCartLabel: string = "Добавить";
	private subscriber: 	any;
	private localState: 	any;
	
	//@Output() updateShoppingCart: EventEmitter<Object> = new EventEmitter<Object>();
	//public isSearchView: boolean 	= false;
	//public _totalPrice: number 		= 0;
	//public _totalAmount: number 	= 0;
	
	constructor(@Inject(EventsService) private eventsService, @Inject(TicketStorage) private ticketStore, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
		this.tickets = new BehaviorSubject<Array<ITicketModel>>(this.ticketsEntity);
	}

	public ngOnInit() : void {
		this.subscriber = this.route.params.subscribe((params : Params) =>
		{
			if (params['id']) {
				this.id 		= +params['id'];
				this.localState = +params['id'];
			}
			this.getEvent();
		});
		//this._totalAmount = this.ticketStore.getTotalAmount();
		//this._totalPrice = this.ticketStore.getTotalPrice();
		this.items = this.ticketStore.getAllTickets();
	}
	
	private getEvent() : void {
		this.eventsService.getEventByID(this.id).then((eventItem: IEventModel) => { this.eventEntity = eventItem; })
												//.then(() => Observable.from(this.eventEntity.products).subscribe((value : ITicketBundle) =>
												//{
												//	this.ticketsEntity.push(new TicketModel(value.name, 1, value.price, {code: '1', name: '1', value: 1}, this.eventEntity.name, value));
												//}));
												/*.then(() => Observable.from(this.eventEntity.tickets).subscribe((value : ITicketBundle) =>
												{
													this.ticketsEntity.forEach((ticket : ITicketModel) =>
													{
														if(ticket.productId == value.productId)
													});
												}))
												.then(() => Observable.from(this.eventEntity.coupons).subscribe((value : ITicketCouponBundle) =>
												{
													this.ticketsEntity.forEach((ticket : ITicketModel) =>
													{
														if(ticket.productId == value.productId)
													});
												}));*/
		/*this.eventEntity =
		{
			id: 7,
			eventId: 7,
			name: 'asdf',
			contentUid: 'asdf',
			startTime: '',
			endTime: '',
			products:
			[
				{ id: 1, eventId: 7, name: 'zxcv', contentUid: '', startTime: '', endTime: '', couponLimit: 10, couponPrice: 1, couponExist: 1 },
				{ id: 2, eventId: 7, name: 'asdf', contentUid: '', startTime: '', endTime: '', couponLimit: 10, couponPrice: 2, couponExist: 1 },
				{ id: 3, eventId: 7, name: 'qwer', contentUid: '', startTime: '', endTime: '', couponLimit: 10, couponPrice: 33, couponExist: 1 },
			]
		};*/
		
		//this.ticketsEntity.push(new TicketModel(1, 7, '1', 1, 1, 1, new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 10, null, 'asdf')); //{code: '1', name: '1', value: 1}
		//this.ticketsEntity.push(new TicketModel('1', 1, 1, null, 'asdf', new EventProductModel(1, 1, '1', '', '21 May 1958 10:12', '22 May 1958 10:12', 10, 1, 10)));
		//{code: '1', name: '1', value: 1}
		//this.ticketsEntity.push(new TicketModel('2', 1, 2, null, 'asdf', new EventProductModel(2, 2, '2', '', '21 May 1958 10:12', '22 May 1958 10:12', 20, 2, 20)));
		//this.ticketsEntity.push(new TicketModel('3', 1, 33, null, 'asdf', new EventProductModel(3, 3, '3', '', '21 May 1958 10:12', '22 May 1958 10:12', 30, 3, 30)));
		//this.ticketsEntity.push(new TicketModel('4', 1, 4, null, 'asdf', new EventProductModel(4, 4, '4', '', '21 May 1958 10:12', '22 May 1958 10:12', 40, 4, 40)));
	}
	
	public addToCart(ticketId: number, eventName: string) : void {
		let ticket = this.getTicket(ticketId);
		if(!ticket) return;
		//if(null != ticket) {
		//	this._totalPrice 	+= ticket.totalPrice;
		//	this._totalAmount 	+= ticket.amount;
		//}
		//this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketModel) => ticketEntity);
		ticket.eventName = eventName;
		this.ticketStore.addItem(ticket);
		//this._totalAmount = this.ticketStore.getTotalAmount();
		//this._totalPrice = this.ticketStore.getTotalPrice();
		this.items = this.ticketStore.getAllTickets();
		//this.tickets.next(this.ticketsEntity);
		//this.ticketStore.addItem(eventProductEntity.eventId, this.ticketsEntity);
	}
	
	public onUpdate(eventProductEntity: IEventProductModel, ticketNumber: number) : void {
		if(isNaN(+ticketNumber) || !Number.isInteger(+ticketNumber)) return;
		//this.update(eventProductEntity.productId, ticketNumber, eventProductEntity.couponPrice * ticketNumber);
		this.tickets.next(this.ticketsEntity);
		//this.ticketStore.addItem(eventProductEntity.eventId, this.ticketsEntity);
		//this.updateShoppingCart.emit({text: '1'});
	}
	
	public ngOnDestroy() : void {
		this.subscriber.unsubscribe();
	}

	private update(id: number, ticketNumber: number, totalPrice: number) : void {
		this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketModel) => (ticketEntity.eventInfo.productId === id)
			?
			{
				eventInfo: ticketEntity.eventInfo,
				couponInfo: ticketEntity.couponInfo,
				totalPrice: totalPrice,
				amount: ticketNumber,
				label: ticketEntity.label,
				discount: ticketEntity.discount,
				eventName: ticketEntity.eventName
			}
			: ticketEntity);
	}
	
	public getTotalPrice(ticketId: number) : number {
		let ticket = this.getTicket(ticketId);
		return (ticket && ticket.totalPrice) ? ticket.totalPrice : 0;
	}
	
	public getTotalAmount(ticketId: number) : number {
		let ticket = this.getTicket(ticketId);
		return (ticket && ticket.amount) ? ticket.amount : 0;
	}
	
	public getTicket(ticketId: number) : ITicketModel {
		return (this.ticketsEntity.filter((ticketEntity: ITicketModel) => (ticketEntity.eventInfo.productId === ticketId))[0]);
	}
	
	public isTicketExist() : boolean {
		return !(null == this.eventEntity.products || 0 === this.eventEntity.products.length);
	}
}
