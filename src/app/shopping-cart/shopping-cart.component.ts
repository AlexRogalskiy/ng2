import { Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { TicketStorage } from '../tickets/model/ticket-storage.component';
import { ITicketModel } from '../tickets/model/ticket.model';
//import {TicketsService } from './shopping-cart.service';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

// Component decorator
@Component({
    selector: 'shopping-cart',
    templateUrl: 'shopping-cart.component.html',
	viewProviders: [ MdIconRegistry ],
	encapsulation: ViewEncapsulation.None
})
export class ShoppingCart implements OnInit {

    @Input('items') items: Array<ITicketModel> = [];
	public ticketInStockLabel: string 			= "В наличии: ";
	public ticketSubPriceLabel: string 			= "Подитог: ";
	public ticketDiscountPriceLabel: string		= "Цена с учетом скидки: ";
	public ticketTotalPriceLabel: string 		= "Итого: ";
	public ticketEventNameLabel: string 		= "Мероприятие:";
		
	public eventLabel: string 					= "Событие";
	public dateStartLabel: string 				= "Дата начала";
	public dateEndLabel: string 				= "Дата окончания";
	public ticketAmountLabel: string 			= "Количество";
	public ticketPriceLabel: string 			= "Стоимость";
	
    constructor(@Inject(TicketStorage) private ticketStore, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('shopping-cart-remove', this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/icon/shopping-cart-remove.svg'));
	}

	public updateItem(ticketEntity: ITicketModel, value: number) : void {
		if(isNaN(+value) || !Number.isInteger(+value)) return;
		this.update(ticketEntity, +value);
	}
	
	public ngOnInit(): void {
		this.items = this.ticketStore.getAllTickets();
	}
	
	public removeFromCart(ticketEntity: ITicketModel) : void {
		this.ticketStore.deleteItem(ticketEntity);
		this.items = this.ticketStore.getAllTickets();
	}
	
	private update(ticketEntity: ITicketModel, value: number) : void {
		ticketEntity.amount = value;
		//ticketEntity.totalPrice = ticketEntity.eventInfo.couponPrice * value;
		this.ticketStore.updateItem(ticketEntity);
	}
	
	public getItems() : Array<ITicketModel> {
		return this.ticketStore.getAllTickets();
	}
	
	public isTicketStorageEmpty() : boolean {
		return this.ticketStore.isTicketStoreEmpty();
	}
}
