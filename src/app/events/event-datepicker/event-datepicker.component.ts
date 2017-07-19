import { Component, HostListener, Input, Output, Inject, EventEmitter, ViewEncapsulation } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'datepicker',
	styleUrls: ['./event-datepicker.component.css'],
	templateUrl: './event-datepicker.component.html'
})

export class DatePicker {
	@Output() change: EventEmitter<Object> = new EventEmitter<Object>();
	
	@Input('model') model: any 					= new Date();
	@Input('type') type: any 					= 'datetime';
	@Input('placeholder') placeholder: string 	= 'Выберите дату';
	@Input('format') format: string 			= 'DD/MM/YYYY HH:mm';
	@Input('name') name: string 				= '';
	@Input('className') className: string 		= '';
	@Input('disabled') disabled: boolean 		= false;
	@Input('required') required: boolean 		= false;
	//@Input('mode') mode: string 				= 'portrait';
	//@Input('container') container: string 	= 'inline';
	//@Input('openOnFocus') openOnFocus: boolean= false;
	//@Input('isOpen') isOpen: boolean 			= false;
	
	//@Input('min') minDate: any 					= '';
	//@Input('max') maxDate: any 					= '';
	//[min]="minDate"
	//[max]="maxDate"
	
	//private date: any = '2016-09-15';
	//private time: any = '12:10';
	//private minDate: any = '2016-07-15';
	//private maxDate: any = '2016-12-15';
	
	constructor(@Inject(EventsService) private eventsService) {}
  
	//@HostListener('change', ['$event'])
	private onChangeDatePicker(data: any, name: string) : void {
		this.change.emit({text: data, name: name});
	}
}