import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ErrorHandler {

	constructor(private logger: Logger) {}

	public handleError(error: Response, defaultErrorMessage: string = 'Internal server error') : Observable<string> {
		let message = '';
		if(error) {
			message = `\n status code < ${error.status} >, \n status text < ${error.statusText} >, \n url < ${error.url} >\n`;
		} else {
			message = defaultErrorMessage;
		}
		this.logger.log(message);
		//return Promise.reject(message);
		return Observable.throw(message);
	}
}