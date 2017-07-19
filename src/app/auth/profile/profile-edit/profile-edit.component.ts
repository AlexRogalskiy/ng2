import { Component }            from '@angular/core';
import { Router }               from '@angular/router';

import 'rxjs/add/operator/map';

import { IUserInfo } from '../../user-info.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'profile',
  templateUrl: 'profile-edit.component.html'
})

export class ProfileEdit {
	private userInfo: IUserInfo = null;
	
	constructor(private auth: AuthService, private router: Router) {
		this.userInfo = this.auth.getUserProfile();
	}

	public onSubmit() : void {
		this.auth.updateProfile(this.userInfo);
		this.router.navigate(['/profile']);
	}
}