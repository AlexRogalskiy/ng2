import { Component, ViewChild, ViewEncapsulation, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { TicketStorage } from '../../tickets/model/ticket-storage.component';
import { ITicketModel } from '../../tickets/model/ticket.model';
import { ITicketUserInfo, TicketUserInfo } from '../../tickets/model/ticket-user-info.model';

@Component({
    selector: 'shopping-cart-dialog',
    templateUrl: 'shopping-cart-dialog.component.html',
    styleUrls: ['shopping-cart-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ShoppingCartDialog {
    
    @ViewChild('shoppingCart') modal: ModalComponent;
	@Input('items') items: Array<ITicketModel> = [];
	
    private selected: string;
    private output: string;
    private model: ITicketUserInfo = new TicketUserInfo();
	
	private dialogTitle: string = "Корзина";
	private firstName: string 	= "Имя";
	private lastName: string 	= "Фамилия";

    private index: number = 0;
    private backdropOptions = [true, false, 'static'];
    private cssClass: string = 'shopping-cart-dialog';

    private animation: boolean = true;
    private keyboard: boolean = true;
    private backdrop: string | boolean = true;
    private css: boolean = false;

    constructor(@Inject(TicketStorage) private ticketStore, private router: Router) {}

    public closed() : void {
        this.output = '(closed) ' + this.selected;
    }

    public dismissed() : void {
        this.output = '(dismissed)';
    }

    public opened() : void {
        this.output = '(opened)';
    }

    public navigate() : void {
        this.router.navigateByUrl('/hello');
    }

    public open() : void {
        this.modal.open();
    }
	
	public saveShoppingCart(event) : void {
		this.items = this.ticketStore.getAllTickets();
		this.ticketStore.saveItems(this.items, this.model);
		//event.stopPropagation();
	}
	
	public clearShoppingCart(event) : void {
		this.ticketStore.clearItems();
		event.stopPropagation();
	}
	
	public buyShoppingCart(event) : void {
		event.stopPropagation();
	}
}