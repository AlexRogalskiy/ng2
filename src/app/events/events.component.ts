/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Component, Directive, ElementRef, ViewEncapsulation, ViewChild, ViewChildren, ContentChild, Input, Output, QueryList, EventEmitter, ContentChildren, OnInit, AfterContentInit, AfterViewInit, Inject, HostBinding, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { EventsService } from "./events.service";
import { TicketsService } from "../tickets/tickets.service";
import { ITicketBundle } from "../tickets/model/ticket-bundle.model";
import { IEventModel, EventModel } from "./model/event.model";
import { NotificationService } from '../common/notification/notification.service';

import { OrderDialog } from '../order/order-dialog.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { TicketStorage } from '../tickets/model/ticket-storage.component';
import { DatePicker } from './datepicker/datepicker.component';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'events',
	templateUrl: './events.component.html',
	viewProviders: [ MdIconRegistry ],
	styleUrls: ['./events.component.css'],
	animations:
	[
		trigger('menuAnimate',
		[
			state('in', style({
				transform: 'translate3d(0, 0, 0)',
				right: 'auto',
				left: '0px',
			})),
			state('out', style({
				transform: 'translate3d(-100%, 0, 0)',
				right: 'auto',
				left: '54px',
			})),
			transition('in => out', animate('400ms ease-in-out')),
			transition('out => in', animate('400ms ease-in-out'))
		]),
		trigger('iconAnimate',
		[
			state('inactive', style({
				//transform: 'rotate3d(1, 0, 0, 0)',
				transform: 'rotate3d(0, 0, 2, 0deg)',
            })),
            state('active', style({
				//transform: 'rotate3d(1, 0, 0, 60deg)',
				transform: 'rotate3d(0, 0, 2, 90deg)',
            })),
            transition('inactive => active', animate('50ms ease-in')),
            transition('active => inactive', animate('50ms ease-out')),
		])
	],
})

export class Events implements OnInit {
	@ViewChild("shoppingCartDialog") modal: ModalComponent;
	@ViewChild("orderDialog") orderModal: OrderDialog;
	@HostBinding('attr.type') type = 'datetime';
	
	//@HostBinding('attr.svgIcon') icon = 'menu';
	private _icon = "menu"
	@HostBinding('attr.svgIcon')
	get icon() { return this._icon; }
	set icon(icon) { this._icon = icon; }
	
	private datePickerModel: any = new Date();
	private datePickerStartPlaceholder: string 	= "Дата/время начала";
	private datePickerEndPlaceholder: string 	= "Дата/время окончания";
	private datePickerFormat: string 			= "DD/MM/YYYY HH:mm";
	private datePickerFromDateName: string 		= "start";
	private datePickerToDateName: string 		= "end";
	
	private isSearchView: boolean = true;
	private isSideBarOpened: boolean = true;
	
	//private datePlaceHolder: string = "Введите дату";
	//private date: Date = new Date();
	
	private events: Array<IEventModel> 			= [];
	private events$: Observable<IEventModel>	= null;
	private eventsView: Array<IEventModel> 		= [];
	
	private scrollThrottle: number = 300;
	private scrollDistance: number = 2;
	
	private itemsPerView: number = 10;
	private itemsPerPage: number = 10;
	
	private menuState: string = 'out';
	private iconState: string = 'inactive';
	
	//@ViewChild(EventModel) eventViewChild: EventModel;
	//@ViewChildren(EventModel) eventViewChildren: QueryList<EventModel>;
	//@ContentChild(EventModel) eventContentChild: EventModel;

	constructor(
		@Inject(EventsService) private eventsService,
		@Inject(TicketStorage) private ticketStore,
		@Inject(TicketsService) private ticketsService,
		
		private mdIconRegistry: MdIconRegistry,
		private sanitizer: DomSanitizer,
		
		private alertService: NotificationService) {
		//console.log('new - eventViewChild is ' + this.eventViewChild);
		this.mdIconRegistry.addSvgIcon('up-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/up-arrow.svg'));
		this.mdIconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/menu.svg'));
	}
	
	public ngAfterContentInit() : void {
		//console.log('ngAfterContentInit - eventContentChild is ' + this.eventContentChild);
		//console.log(this.events);
	}
  
	public ngAfterViewInit() : void {
		//console.log('ngAfterViewInit - eventViewChildren is ' + this.eventViewChildren);
		//this.events = this.eventViewChildren.toArray();
		//console.log(this.events);
	}
	
	public ngOnInit() : void {
		this.getEventsList();
		//this.events = this.getEventsList();
		//this.addItems(0, this.itemsPerView);
	}
	
	public addEvents(_events: IEventModel[]) : void {
		if(null == _events) return;
		_events.forEach((item: IEventModel) => { this.events.push(item); });
	}
	
	public addEvent(_event: IEventModel) : void {
		this.events.push(_event);
		//this.events[_event.id] = _event;
	}
	
	public removeEvent(_event: IEventModel) : void {
		if(null == _event) return;
		
		for(var i=0, len=this.size(); i<len; i++) {
			if(_event === this.events[i]) {
				this.events.splice(i, 1);
				//this.events[i] = null;
			}
		}
	}
	
	public setEvent(_event: IEventModel, index: number) : void {
		if(index < 0) {
			return null;
		}
		this.events[index] = _event;
	}
	
	public getEventByID(index: number) : IEventModel {
		if(index < 0 || index >= this.size()) {
			return null;
		}
		return this.events[index];
	}
	
	public getAllEvents() : IEventModel[] {
		return (this.events);
	}
	
	public findEvent(name: string) : number {
		if(null == name) return;
		return this.events.findIndex((item : IEventModel) => { return item.name === name; });
	}
	
	public removeEventBy(name: string) : void {
		var idx = this.findEvent(name);
		if(null == idx || -1 === idx) return;
		this.events.splice(idx, 1);
	}
	
	private addItems(startIndex, endIndex) : void {
		let temp = this.events.slice(startIndex, endIndex);
		for (let i = 0; i < temp.length; ++i) {
			this.eventsView.push(temp[i]);
		}
	}
	
	public isEmptyList() : boolean {
		return (0 == this.size());
	}
	
	private size() : number {
		return (this.events.length);
		/*var size = 0, key;
		for (key in this.events) {
			if (this.events.hasOwnProperty(key)) size++;
		}
		return size;*/
	}
	
	public onSelect(_event: IEventModel) : void {
        console.log('card: ' + _event.eventId + ' : ' + _event.name);
    }
	
	private getEventsList() : void {
		/*let eventEntity = new EventModel();
		eventEntity.id = 7;
		eventEntity.name = "Event";
		eventEntity.contentUid = "Event";
		eventEntity.startTime = new Date().toString();
		eventEntity.endTime = new Date().toString();
		
		let eventEntity2 = new EventModel();
		eventEntity2.id = 6;
		eventEntity2.name = "Event2";
		eventEntity2.contentUid = "Event2";
		eventEntity2.startTime = new Date().toString();
		eventEntity2.endTime = new Date().toString();
		//this.events =
		return [
			eventEntity, eventEntity2, eventEntity, eventEntity, eventEntity, eventEntity, eventEntity
		];*/
		this.eventsService.getEvents().then((eventItem: Array<IEventModel>) => this.events = eventItem );
		//return this.events;
		//this.ticketsService.getAvailableTickets(eventItem.id).then((ticketBundle: ITicketBundle) => eventItem.price = ticketBundle.price);
    }
	
	private onScrollDown() : void {
		const initialItems = this.itemsPerPage;
		this.itemsPerPage += this.itemsPerView;
		//this.addItems(initialItems, this.itemsPerPage);
	}
	
	private searchTerm(events) : void {
		if(null == events) return;
		this.events = events;
	}
	
	public onUpdate(event) : void {
		console.log('onUpdate');
	}
	
	public onUpdateSearch(events) : void {
		this.events = events;
		this.alertService.alert(`The search mask has been changed!`);
	}
	
	public onUpdateStyle(event) : void {
		this.alertService.alert(`The basic style has been changed!`);
	}
	
	public trackByEvents(index: number, eventEntity: IEventModel) : number {
		return new Date(eventEntity.startTime).getTime();
	}
	
	//@HostListener('mouseenter', ['$event.target'])
	public onMouseEnter(target: any){
		this.menuState = ((this.menuState === 'out') ? 'in' : 'out');
		this.iconState = ((this.iconState === 'inactive') ? 'active' : 'inactive');
	}

	//@HostListener('mouseleave', ['$event.target'])
	public onMouseLeave(target: any){
		this.menuState = ((this.menuState === 'out') ? 'in' : 'out');
		this.iconState = ((this.iconState === 'inactive') ? 'active' : 'inactive');
	}
	
	public sliderModel: number[] = [0, 5000];
	private sliderConfig: any =
	{
		//behaviour: 'drag',
		connect: true,
		start: this.sliderModel,
		keyboard: true,
		step: 100,
		pageSteps: 100,
		range:
		{
			min: 0,
			max: 5000
		},
		pips:
		{
			mode: 'count',
			density: 2,
			values: 6,
			stepped: true
		}
	}
	
	public changeDate(data: any) : void {
		let dateStart, dateEnd = '';
		if(this.datePickerFromDateName == data.name) {
			dateStart = data.text;
		}
		if(this.datePickerToDateName == data.name) {
			dateEnd = data.text;
		}
		this.eventsService.searchEventsByDateRange(dateStart, dateEnd).then((value: Array<IEventModel>) => { this.events = value; });
		
		let filteredEvents: Array<IEventModel> = [];
		this.events$ = Observable.from(this.events).map((data: IEventModel) => { return data; });
		this.events$.subscribe((entity: IEventModel) =>
		{
			if(this.datePickerFromDateName == data.name) {
				if(new Date(entity.startTime).getTime() > Date.parse(data.text)) {
					filteredEvents.push(entity);
				}
			}
			if(this.datePickerToDateName == data.name) {
				if(new Date(entity.startTime).getTime() < Date.parse(data.text)) {
					filteredEvents.push(entity);
				}
			}
		});
		this.alertService.alert(`The date has been changed!`);
	}
	
	@HostListener('ngModelChange', ['$event.target'])
	private onSliderChange(event) : void {
		this.eventsService.searchEventsByPriceRange(this.sliderModel[0], this.sliderModel[1]).then((value: Array<IEventModel>) => { this.events = value; });
		this.alertService.alert(`The slider range has been changed!`);
		/*let pBundle: Promise<ITicketBundle> 	= null;
		let filteredEvents: Array<IEventModel> = [];
		this.events$ = Observable.from(this.events).map((data: IEventModel) => { return data; });
		this.events$.map((entity: IEventModel) =>
					{
						pBundle = this.ticketsService.getAvailableTickets(entity.id);
						return entity;
					})
					.subscribe((entity: IEventModel) => pBundle.then((tb: ITicketBundle) =>
					{
						if(tb.price < this.sliderModel[1] && tb.price > this.sliderModel[0]) {
							filteredEvents.push(entity);
							//return entity;
						}
					}).then(() => this.events = filteredEvents));*/
	}
	
	public order(eventId: number) {
        this.orderModal.open(eventId);
    }
}
