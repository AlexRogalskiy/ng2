import { Inject, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

import { AuthService } from '../service/auth.service';

@Component({
	selector: 'main-component',
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.css']
})

export class MainAuthComponent {
	private jwt: 		string	= null;
	//private decodedJwt: string 	= null;
	//private jwtDate: 	Date 	= null;
	//private jwtExpired: boolean = false;
			
	private response: 	string = null;
	private jwtHelper: JwtHelper = new JwtHelper();

	constructor(@Inject('APP_CONFIG') private config, private sessionStorageService: SessionStorageService, private router: Router, private http: Http, private authHttp: AuthHttp, private auth: AuthService) {
		this.jwt = this.sessionStorageService.retrieve(this.config.authConfig.accessToken);
		//if(this.jwt) {
		//	this.decodedJwt = this.jwtHelper.decodeToken(this.jwt);
		//	this.jwtDate 	= this.jwtHelper.getTokenExpirationDate(this.jwt);
		//	this.jwtExpired = this.jwtHelper.isTokenExpired(this.jwt);
		//}
	}

	public logout() : void {
		this.sessionStorageService.clear(this.config.authConfig.accessToken);
		this.router.navigate(['login']);
	}

	public callAnonymousApi() : void {
		this._callApi('Anonymous', 'http://localhost:3001/api/random-quote');
	}

	public callSecuredApi() : void {
		this._callApi('Secured', 'http://localhost:3001/api/protected/random-quote');
	}

	private _callApi(type, url) : void {
		if (type === 'Anonymous') {
			this.http.get(url)
				.subscribe(
					response	=> this.response = response.text(),
					error 		=> this.response = error.text()
				);
		}
		if (type === 'Secured') {
			this.authHttp.get(url)
				.subscribe(
					response 	=> this.response = response.text(),
					error 		=> this.response = error.text()
				);
		}
	}
}