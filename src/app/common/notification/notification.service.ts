import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
	private show: boolean 	= false;
	private type: string 	= 'info';
	private message: string = '';
	
	constructor() {}

	public alert(message: string, type: string = 'info', autohide: number = 5000) {
		this.show = true;
		this.type = type;
		this.message = message;
		
		if (autohide) {
			setTimeout(() =>
			{
				this.close();
			}, autohide);
		}
	}

	public close() {
		this.show = false;
	}
}