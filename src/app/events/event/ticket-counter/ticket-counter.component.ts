import { Component, OnInit, forwardRef, Input, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

export class TicketCounterSettings
{
	public static DEFAULT_MAX_VALUE: number = 9999;
	public static DEFAULT_MIN_VALUE: number = 1;
	
	public static createCounterRangeValidator(maxValue, minValue) : any {
		return (control: FormControl) =>
		{
			let error = {
				rangeError:
				{
					given: control.value,
					max: maxValue || TicketCounterSettings.DEFAULT_MAX_VALUE,
					min: minValue || TicketCounterSettings.DEFAULT_MIN_VALUE
				}
			};
			return (control.value > +maxValue || control.value < +minValue) ? error : null;
		}
	}
}

@Component({
	selector: 'counter',
	templateUrl: 'ticket-counter.component.html',
	styleUrls: ['ticket-counter.component.css'],
	providers:
	[
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TicketCounter), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => TicketCounter), multi: true }
	],
})

export class TicketCounter implements ControlValueAccessor, OnChanges, OnInit {
	public localState: any;
	public price: number = 0;
	public submitted: boolean = false;
	
	private propagateChange: any = () => {};
	private validateFn: any = () => {};

	@Output() update: EventEmitter<Object> = new EventEmitter<Object>();
	@Input('counterLabel') counterLabel  = "";
	@Input('counterValue') _counterValue = 1;
	@Input('counterRangeMin') counterMin = TicketCounterSettings.DEFAULT_MIN_VALUE;
	@Input('counterRangeMax') counterMax = TicketCounterSettings.DEFAULT_MAX_VALUE;
	
	public ticketForm: FormGroup;
	private ticketCounterField : FormControl;
	//private ticketCounter: Observable<number>;
	//private ticketCounter = new Subject<String>();

	public get counterValue() {
		return this._counterValue;
	}
  
	public set counterValue(value) {
		if(value < this.counterMin || value > this.counterMax) value = 1;
		this._counterValue = value;
		this.propagateChange(value);
	}

	public ngOnChanges(inputs) : void {
		if (inputs.counterMax || inputs.counterMin) {
			this.validateFn = TicketCounterSettings.createCounterRangeValidator(this.counterMax, this.counterMin);
			this.propagateChange(this.counterValue);
		}
	}

	public writeValue(value) : void {
		if (isNaN(value)) return;
		let pattern = /^[0-9]+$/;
		if(pattern.test(value)) {
			this.counterValue = value;
			this.localState = value;
		} else {
			this.counterValue = 1;
		}
	}

	public registerOnChange(fn) : void {
		this.propagateChange = fn;
	}

	public registerOnTouched() : void {}
	
	public changeCounter(event) : void {
		this.writeValue(event);
		this.update.emit({text: this.counterValue});
	}

	public increase(event) : void {
		this.counterValue++;
		this.update.emit({text: this.counterValue});
	}

	public decrease(event) : void {
		this.counterValue--;
		this.update.emit({text: this.counterValue});
	}

	public validate(c: FormControl) : void {
		return this.validateFn(c);
	}
	
	public ngOnInit() : void {
		this.ticketForm = new FormGroup({
			ticketCounter: new FormControl(this.counterValue,
												[
													TicketCounterSettings.createCounterRangeValidator(this.counterMax, this.counterMin),
													<any>Validators.required,
													<any>Validators.minLength(1),
													<any>Validators.maxLength(4),
													<any>Validators.pattern(/^[0-9]+$/),
													CustomValidators.digits,
													CustomValidators.min(this.counterMin),
													CustomValidators.max(this.counterMax)
												])
		});
		this.ticketCounterField = (<FormControl>this.ticketForm.controls['ticketCounter']);
		this.subcribeToFormChanges();
	}
	
	private subcribeToFormChanges() : void {
		//.switchMap((ticketNumber: number) => this.eventsService.getAvailableTickets(ticketNumber));
		//this.ticketNumberField.valueChanges.debounceTime(400).distinctUntilChanged().map((str: string) => str.replace('\D','')).subscribe(value => console.log(value));
		this.ticketCounterField.valueChanges.distinctUntilChanged().subscribe(value => { this.writeValue(value); });
	}
}