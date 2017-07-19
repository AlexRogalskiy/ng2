import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, Output, Input, EventEmitter, HostListener } from '@angular/core';

import { IEventModel } from '../model/event.model';

import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';

import { EventsService } from '../events.service';
  
@Component({
	selector: 'event-search',
	templateUrl: 'event-search.component.html',
	styleUrls: ['event-search.component.css'],
})

export class EventSearch implements OnInit {
	private events: Observable<IEventModel[]>;
	private searchTerm = new Subject<string>();

	private options: Array<IEventModel> = [];
	//private filterEvents: Observable<Array<IEventModel>>;
	
	@Output() change: EventEmitter<Object> = new EventEmitter<Object>();
	
	private searchForm: FormGroup;
	private searchField : FormControl;
	
	@Input('placeholderLabel') placeholderLabel: string 	= "Найти";
	@Input('notFoundLabel') notFoundLabel: string 			= "Ничего не найдено";
	@Input('loadingDataLabel') loadingDataLabel: string 	= "Загрузка данных ...";
	@Input('isInputEnabled') isInputEnabled: boolean 		= true;
	@Input('maxNumList') maxNumList: number 				= 20;
	@Input('minNumChars') minNumChars: number 				= 1;

	constructor(@Inject(EventsService) private eventsService, private router: Router) {}
	
	public ngOnInit(): void {
		this.searchForm = new FormGroup({searchTerm: new FormControl('',[<any> Validators.required])});
		this.searchField = (<FormControl>this.searchForm.controls['searchTerm']);
		this.getOptionsList();
		this.searchFieldChanges();
	}
	
	private getOptionsList() : void {
		this.eventsService.getEvents().then((_option: Array<IEventModel>) => this.options = _option);
	}
	
	private searchFieldChanges() : void {
		//this.filterEvents = this.searchField.valueChanges
		//											   .startWith(null)
		//											   .map((value: any) => this.displayOptions(value))
		//											   .map((value: string) => this.filterOptions(value));
		this.searchField.valueChanges.debounceTime(400).distinctUntilChanged()
													   .map((term: string) => this.displayOptions(term))
													   .switchMap((term: string) => { return this.eventsService.searchEventsByName(term); } )
													   .subscribe((value : Array<IEventModel>) => this.change.emit({text: value}));
	}
	
	//private filterOptions(value: string): Array<IEventModel> {
	//	return ((value) ? this.options.filter((_value: IEventModel) => { return _value.name.toLowerCase().indexOf(value.toLowerCase()) > -1; }) : this.options); 
	//}

	private displayOptions(value: any): string {
		return ((value && typeof value === 'object') ? value.name : value);
	}

	public dataListFormatter(data: any): string {
		let startDate = this.formatDateTime(data.startTime);
		let endDate = this.formatDateTime(data.endTime);
		return `${data.name} (${startDate} - ${endDate})`;
    }
	
	private formatDateTime(dateTime: string, options?: any, format: string = 'ru-RU') : string {
		options = options || { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
		let dateStr = new Date(dateTime).toLocaleDateString(format, options);
		return dateStr;
	}

}
