import { Component, Input, Output, Injectable, Inject, OnInit, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { IEventProductModel } from '../../events/model/event-product.model';
import { ITicketUserInfo, TicketUserInfo } from './ticket-user-info.model';
import { ITicketDiscount, TicketDiscount } from './ticket-discount.model';
import { ITicketState, TicketState } from './ticket-state.model';
import { ITicketModel, TicketModel } from './ticket.model';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

const defaultTicketState =
{
    tickets: [],
	userInfo: new TicketUserInfo(),
};

@Injectable()
export class TicketStorage implements OnInit {
    
	private static EMPTY_DISCOUNT_VALUE: number = 1;
	private discounts: Array<ITicketDiscount> = 
	[
		{ code: '1', name: '1', value: 0.9 },
		{ code: '2', name: '2', value: 0.8 },
		{ code: '3', name: '3', value: 0.7 },
		{ code: '4', name: '4', value: 0.6 },
	];
	
	private token: string = '';
	private ticketStorage: BehaviorSubject<ITicketState> = null;
	
	constructor(@Inject('APP_CONFIG') private config, private sessionStorageService: SessionStorageService) {
		let ticketState: ITicketState = { tickets: this.getAllTickets() };
		this.ticketStorage = new BehaviorSubject<ITicketState>(ticketState);
	}
	
	public ngOnInit(): void {
		this.ticketStorage.distinctUntilChanged().subscribe((value) => console.log('asdfasdf' + value));
		//this.sessionStorageService.observe(this.config.storageKey).subscribe(( value: string ) => { console.log(JSON.parse(value)); });
	}

    public setCartState(state: ITicketState) {
        this.ticketStorage.next(state);
    }

    private getCartState() : ITicketState {
        return this.ticketStorage.value;
    }

    public purgeCartState() : void {
        this.ticketStorage.next(defaultTicketState);
		this.sessionStorageService.clear(this.config.storageKey);
    }
	
	public addItem(_ticketEntity: ITicketModel) : void {
		let tickets: Array<ITicketModel> = this.getAllTickets() || [];
		if(this.hasItem(_ticketEntity)) {
			// && ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId
			tickets = tickets.map((ticketEntity: ITicketModel) => (ticketEntity.eventInfo.productId === _ticketEntity.eventInfo.productId)
					?
					{
						eventInfo: _ticketEntity.eventInfo,
						couponInfo: _ticketEntity.couponInfo,
						amount: _ticketEntity.amount + ticketEntity.amount,
						totalPrice: _ticketEntity.totalPrice + ticketEntity.totalPrice,
						label: _ticketEntity.label,
						eventName: _ticketEntity.eventName,
						discount: _ticketEntity.discount
					}
					: ticketEntity);
		} else {
			tickets.push(_ticketEntity);
		}
		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
	}
	
	public updateItem(_ticketEntity: ITicketModel) : void {
		let tickets = this.getAllTickets();
		//&& ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId
		tickets = tickets.map((ticketEntity: ITicketModel) => (ticketEntity.eventInfo.productId === _ticketEntity.eventInfo.productId)
				?
				  _ticketEntity
				: ticketEntity);

		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
	}
	
	public saveItems(tickets: Array<ITicketModel>, userInfo: ITicketUserInfo) : void {
		let ticketState: ITicketState = { tickets: tickets, userInfo: userInfo };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
	}
	
	public hasItem(_ticketEntity: ITicketModel) : boolean {
		if(this.isTicketStoreEmpty()) return false;
		//&& ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId
		return (this.getAllTickets().filter((ticketEntity: ITicketModel) => (ticketEntity.eventInfo.productId === _ticketEntity.eventInfo.productId))[0])
				? true
				: false;
	}
	
	public deleteItem(_ticketEntity: ITicketModel) : void {
		//&& ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId
		let tickets = this.getAllTickets().filter((ticketEntity : ITicketModel) => { return !(ticketEntity.eventInfo.productId === _ticketEntity.eventInfo.productId) });
		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
	}
	
	public clearItems() : void {
		this.ticketStorage.next(defaultTicketState);
		this.sessionStorageService.clear(this.config.storageKey);
	}
	
	public isTicketStoreEmpty() : boolean {
		return (null == this.getAllTickets() || 0 === this.getAllTickets().length);
	}
	
	public getTickets() : Array<ITicketModel> {
		return (this.getAllTickets()) ? [] : this.getAllTickets();
	}

	public getTotalPrice() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalPrice = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.totalPrice, totalSum;
        }, 0);
        return totalPrice;
	}
	
	public getTotalPriceWithDiscount() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalPrice = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.totalPrice * ((cartItem.discount) ? cartItem.discount.value : TicketStorage.EMPTY_DISCOUNT_VALUE), totalSum;
        }, 0);
        return totalPrice;
	}
	
	public getTotalAmount() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalAmount = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.amount, totalSum;
        }, 0);
        return totalAmount;
	}
	
	private getDiscount(discountCode: string) : ITicketDiscount {
		return this.discounts.filter((discount: ITicketDiscount) => discount.code === discountCode)[0];
	}
	
	private getDiscountValue(discountCode: string) : number {
		let discount = this.getDiscount(discountCode);
		return (discount) ? discount.value : TicketStorage.EMPTY_DISCOUNT_VALUE;
	}
	
	private getStorageData() : ITicketState {
		let ticketState = this.sessionStorageService.retrieve(this.config.storageKey);
		try {
			ticketState = (ticketState) ? JSON.parse(ticketState) : null;
		} catch(err) {
			ticketState = null;
		}
		return ticketState;
	}
	
	public getAllTickets() : ITicketModel[] {
		let storageData = this.getStorageData();
		return storageData ? storageData.tickets : [];
	}
	
	public getUserInfo() : ITicketUserInfo {
		let storageData = this.getStorageData();
		return storageData ? storageData.userInfo : null;
	}
}