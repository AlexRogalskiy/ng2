import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { AuthService } from './auth.service';
import { IUserInfo } from '../user-info.model';

@Injectable()
export class AuthGuard implements CanActivate {
	
	private userInfo: IUserInfo		= null;
	private credentials: any	= null;
	private sessionId: string	= null;
	
	constructor(@Inject(AuthService) private authService, private router: Router) {}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		let url: string = state.url;
		this.userInfo.ssid = route.params['session_id'];
		return this.checkLogin(url);
	}

	public checkLogin(url: string) : boolean {
		if(this.isLoggedIn()) { return true; }
		this.router.navigate(['/login']);
		return false;
	}
	
	public login() : void {
		this.userInfo = this.authService.getInstance()
                						.login(this.credentials)
                						.then(result => {
                							console.log('login');
                						});
	}
		
	public isLoggedIn() : boolean {
		if(this.authService.checkUserInfo(this.userInfo)) { return true; }
		return false;
	}
}