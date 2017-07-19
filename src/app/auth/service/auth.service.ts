import { Injectable, Inject } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Router } from '@angular/router';
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';

import { IUserInfo } from '../user-info.model';

declare var Auth0Lock: any;
declare var auth0: any;

@Injectable()
export class AuthService {

	private lock = new Auth0Lock(this.config.authConfig.clientId, this.config.authConfig.domain, {});
	
	private auth0 = new auth0.WebAuth(
	{
		domain: this.config.authConfig.domain,
		clientID: this.config.authConfig.clientId,
		callbackURL: this.config.authConfig.callbackURL,
		responseType: 'token ' + this.config.authConfig.tokenId,
	});

	constructor(@Inject('APP_CONFIG') private config, private sessionStorageService: SessionStorageService, private router: Router, public http: Http) {
		this.router.events.filter(event => event.constructor.name === 'NavigationStart')
						  .filter(event => (/this.config.authConfig.accessToken|this.config.authConfig.tokenId|error/).test(event.url))
						  .subscribe(() =>
							{
								this.lock.resumeAuth(window.location.hash, (error, authResult) =>
								{
									if (error) return console.log(error);
									this.sessionStorageService.store(this.config.authConfig.tokenId, authResult.idToken);
									this.router.navigate(['/']);
								});
							});
  
  
		this.lock.on("authenticated", (authResult: any) =>
		{
			this.sessionStorageService.store(this.config.authConfig.accessToken, authResult.idToken);
			this.lock.getProfile(authResult.idToken, (error: any, profile: any) =>
			{
				if (error) {
					console.log(error);
				}
				
				this.sessionStorageService.store(this.config.authConfig.profileKey, JSON.stringify(profile));
				this.router.navigate(['/home']);
			});
			this.lock.hide();
		});
	}

	public isAuthenticated() : boolean {
		// Check whether the id_token is expired or not
		return tokenNotExpired();
	}

	public logout() : void {
		this.sessionStorageService.clear(this.config.authConfig.accessToken);
		this.sessionStorageService.clear(this.config.authConfig.profileKey);
		this.sessionStorageService.clear(this.config.authConfig.tokenId);
		this.router.navigate(['/login']);
	}
	
	public handleAuthentication() : void {
		this.auth0.parseHash((err, authResult) =>
		{
			if (authResult && authResult.accessToken && authResult.idToken) {
				window.location.hash = '';
				this.sessionStorageService.store(this.config.authConfig.accessToken, authResult.accessToken);
				this.sessionStorageService.store(this.config.authConfig.tokenId, authResult.idToken);
				this.router.navigate(['/home']);
			} else if (authResult && authResult.error) {
				alert('Error: ' + authResult.error);
			}
		});
	}
	
	public login(username: string, password: string) : void {
		this.auth0.client.login(
		{
			realm: 'Username-Password-Authentication',
			username,
			password
		}, (err, authResult) =>
		{
			if (err) {
				alert('Error: ' + err.description);
				return;
			}
			if (authResult && authResult.idToken && authResult.accessToken) {
				this.setUser(authResult);
				this.router.navigate(['/home']);
			}
		});
	}
	
	public signup(email: string, password: string) : void {
		this.auth0.redirect.signupAndLogin(
		{
			connection: 'Username-Password-Authentication',
			email,
			password,
		}, function(err)
		{
			if (err) {
				alert('Error: ' + err.description);
			}
		});
	}
	
	public loginWithGoogle() : void {
		this.auth0.authorize({
			connection: 'google-oauth2',
		});
	}
	
	private setUser(authResult: any) : void {
		this.sessionStorageService.store(this.config.authConfig.accessToken, authResult.accessToken);
		this.sessionStorageService.store(this.config.authConfig.tokenId, authResult.idToken);
	}
	
	public updateProfile(userInfo: IUserInfo) : Promise<IUserInfo> {
		if(!userInfo) return Promise.resolve(null);
		let body = JSON.stringify(userInfo);

		let headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
	
		const url = `${this.config.apiUrl}/auth/profile`;
		return new Promise(resolve =>
		{
			this.http.post(url, body, options)
				.map((res: Response) => res.json())
				.subscribe((data: IUserInfo) =>
				{
					this.sessionStorageService.store(this.config.authConfig.profileKey, JSON.stringify(data));
					resolve(data);
				});
		});
	}
	
	public getUserProfile() : IUserInfo {
		let userInfo = this.sessionStorageService.retrieve(this.config.authConfig.profileKey);
		try {
			userInfo = (userInfo) ? JSON.parse(userInfo) : null;
		} catch(err) {
			userInfo = null;
		}
		return userInfo;
	}
}