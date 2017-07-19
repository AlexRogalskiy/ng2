import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';
import { IUserInfo } from '../user-info.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
	
	private static _instance: AuthService = null;
	
	private isLogged: boolean = false;
	
	// store the URL so we can redirect after logging in
	private redirectUrl: string;

	constructor(@Inject('APP_CONFIG') private config, public http: Http) {
		if(AuthService._instance) {
			throw new Error("Error: Instantiation failed: Use AuthService.getInstance() instead of new.");
		} else {
			AuthService._instance = this;
		}
	}
	
	public static getInstance() : AuthService {
		return AuthService._instance;
	}
	
	public checkUserInfo(userInfo: IUserInfo) : Promise<boolean> {
		if(!userInfo) return Promise.resolve(null);
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
		
		const url = `${this.config.apiUrl}`;
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((res: Response) => res.json())
				.subscribe((data: boolean) =>
				{
					resolve(data);
				});
		});
	}

	public login(params: any) : Promise<IUserInfo> {
		if(!params) return Promise.resolve(null);
		let body = JSON.stringify(params);
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
		
		const url = `${this.config.apiUrl}/login`;
		return new Promise(resolve =>
		{
			this.http.post(url, body, options)
				.map((res: Response) => res.json())
				.subscribe((data: IUserInfo) =>
				{
					resolve(data);
				});
		});
	}

	public logout() : void {
		this.isLogged = false;
	}
}