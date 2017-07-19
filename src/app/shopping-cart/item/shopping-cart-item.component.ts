import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { TicketStorage } from './card_back';


@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'shopping-cart-item',
	templateUrl: 'shopping-cart-item.component.html',
	styleUrls: []
})

export class ShoppingCartItem implements OnInit {

    @Input('item') item: String;
	@Input('label') label: String;
	@Output() update: EventEmitter<Object> = new EventEmitter<Object>();
	private isMousedown: boolean = false;
 
	public onClick(event, value) : void {
		console.log(event);
		console.log(value);
	}
	
	public ngOnInit() : void { }
}
