import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
	selector: 'app-notify',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.css'],
	animations:
	[
		trigger('alert',
		[
			transition(':enter', [
				style({
					marginTop: '-36px'
				}),
				animate('500ms ease-in-out', style({
					marginTop: '0px',
				}))
			]),
			transition(':leave', [
				animate('500ms ease-in-out', style({
					marginTop: '-36px'
				}))
			])
		])
	]
})

export class NotificationComponent {
	constructor(private service: NotificationService) { }
}