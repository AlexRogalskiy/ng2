/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Component, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { ITicketModel } from '../../tickets/model/ticket.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'widget-toolbar',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'widget-toolbar.component.html',
	styleUrls: ['widget-toolbar.component.css'],
	viewProviders: [ MdIconRegistry ]
})

export class WidgetToolbar {
	@ViewChild("shoppingCartDialog") shoppingCartModal: ModalComponent;
	@ViewChild("authorizationDialog") authModal: ModalComponent;
	@ViewChild("registrationDialog") registerModal: ModalComponent;
	
	@Input('seachView') searchView: boolean = false;
	@Input('totalAmount') totalAmount: number = 0;
	@Input('totalPrice') totalPrice: number = 0;
	@Input('items') items: Array<ITicketModel> = [];
	
	private shoppingCartLabel: string = 'Корзина';
	private shoppingCartAmount: BehaviorSubject<number> = null;
	private shoppingCartPrice: BehaviorSubject<number> = null;
	
	@Output() updateSearch: EventEmitter<Object> 	= new EventEmitter<Object>();
	@Output() updateStyle: EventEmitter<Object> 	= new EventEmitter<Object>();
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('shopping-cart', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/shopping-cart.svg'));
		this.shoppingCartAmount = new BehaviorSubject<number>(this.totalAmount);
		this.shoppingCartPrice = new BehaviorSubject<number>(this.totalPrice);
	}
	
	private searchTerm(event) : void {
		if(null == event) return;
		this.updateSearch.emit({text: event});
	}
	
	public onUpdate(event) : void {
		if(6 === event.id) {
			this.openAuthDialog(event);
		}
		if(3 === event.id) {
			this.updateStyle.emit({text: event});
		}
	}
	
	public openAuthDialog(event) : void {
		this.authModal.open();
	}
	
	public openRegisterDialog(event) : void {
		this.registerModal.open();
	}
	
	public openShoppingCartDialog(event) : void {
		this.shoppingCartModal.open();
	}
}
