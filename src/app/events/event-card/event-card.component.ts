/**
 * Created by pavel.antoshenko on 1/27/2017.
 */
import { Component, Input, ViewEncapsulation, Inject, OnInit, EventEmitter, Output } from "@angular/core";

import { EventModel } from "../model/event.model";
import { ITicketBundle, TicketBundle } from "../../tickets/model/ticket-bundle.model";

import { TicketsService } from "../../tickets/tickets.service";

@Component({
	selector: 'event-card',
	templateUrl: './event-card.component.html',
	styleUrls: ['./event-card.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class EventCard implements OnInit {
	private ticketBundle: ITicketBundle = null;
	// Event Tag
	@Input('event') event: EventModel;
	//Tag Attributes
	@Input() id: number;
	@Input() name: string;
    @Input() visible: boolean = true;
	@Input() selected: boolean = false;
	@Output() order = new EventEmitter<number>();

	constructor(@Inject(TicketsService) private ticketsService) {}
	
	public mouseEnter(div: string) {
		console.log("mouse enter : " + div);
	}

	public mouseLeave(div: string) {
		console.log('mouse leave :' + div);
	}
	
	public getSubTitle() {
		return this.event.subTitle;
	}
	
	public getTitle() {
		return this.event.title;
	}
	
	/*
	public flipCard() {
		var cards = document.querySelectorAll(".card.effect__click");
		for ( var i  = 0, len = cards.length; i < len; i++ ) {
			var card = cards[i];
			clickListener( card );
		}

		function clickListener(card) {
			card.addEventListener( "click", function() {
				var c = this.classList;
				c.contains("flipped") === true ? c.remove("flipped") : c.add("flipped");
			});
		}
	}
	*/
	
	public ngOnInit() : void {
		this.getTicketBundle();
	}

	private getTicketBundle() : void {
		this.ticketBundle  = new TicketBundle(4, 8, 250 * Math.random(), 1100, 'asdfasdf', 0);
		//this.ticketsService.getAvailableTickets(event.id).then((_ticketBundle: ITicketBundle) => this.ticketBundle = _ticketBundle);
	}
	
	public openOrderModal(eventId: number) {
        this.order.emit(eventId);
    }	
}
