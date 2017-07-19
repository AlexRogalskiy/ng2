import { Component, ViewChild, Output, EventEmitter } from '@angular/core';

import { TariffEntity } from '../entity/tariff.entity';
import { TicketEntity } from '../entity/ticket.entity';

@Component({
    selector: 'order-tariffs',
    templateUrl: 'tariffs.component.html',
    styleUrls: ['tariffs.component.css'],
})
export class OrderTariffs {
    
    private tariffs: TariffEntity[];
    private tickets: TicketEntity[];

    @Output() update = new EventEmitter<TicketEntity[]>();

    constructor() {}
    
    getTariffs() {
        return this.tariffs;
    }
    
    setPurchases(purchases: TicketEntity[]) {
        this.tickets = purchases;
        if (this.tickets && !this.tickets.length) { //Step selection fix
            this.tickets = null;
        }
    }
    
    setTariffs(tariffs: TariffEntity[]) {
        this.tariffs = [];
        if (tariffs instanceof Array) {
            this.tariffs = tariffs;
        } else {
            this.tariffs.push(tariffs);
        }
    }
    
    tariffsAvailible() {
        if (this.tickets && this.tariffs) {
            if (this.tickets.length == this.tariffs.length) {
                return false;
            }
        }
        return true;
    }
    
    purchase(tariff: TariffEntity) {
        if (!this.tickets) {
            this.tickets = [];
        }
        this.tickets.push(new TicketEntity(tariff, 1));
        this.update.emit(this.tickets);
    }
    
    isPurchased(tariff: TariffEntity) {
        if (!this.tickets) {
            return false;
        }
        for (var ticket of this.tickets) {
            if (tariff === ticket.tariff) {
                return true;
            }
        }
        return false;
    }
    
    checkNull(ticket: TicketEntity) {
        if (isNaN(parseInt(''+ticket.quantity)) || !isFinite(ticket.quantity)) {
            this.setQuantity(ticket, 0);
        }
    }
    
    setQuantity(ticket: TicketEntity, newQuantityString) {
        let newQuantity = parseInt(''+newQuantityString); //In case to protect from uncertain user input
        if (isNaN(newQuantity) || !isFinite(newQuantity)) {
            ticket.quantity = null;
            return;
        }
        if (newQuantity == 0) {
            this.tickets.splice(this.tickets.indexOf(ticket), 1);
            if (this.tickets.length == 0) {
                this.tickets = null;
            }
        } else {
            let index = this.tickets.indexOf(ticket);
            if (index >= 0) {
                if (newQuantity > ticket.tariff.limit) {
                    newQuantity = ticket.tariff.limit;
                }
                this.tickets.find(it => it === ticket).quantity = newQuantity;
            }
        }
        this.update.emit(this.tickets);
    }
    
    getSummary() {
        var summary = 0;
        for (let ticket of this.tickets) {
            summary += ticket.quantity * ticket.tariff.price;
        }
        return summary;
    }
    
}