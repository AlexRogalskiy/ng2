import { Component } from '@angular/core';

import { AuthService } from '../../service/auth.service';
import { IUserInfo } from '../../user-info.model';

@Component({
  selector: 'profile_show',
  templateUrl: 'profile-show.component.html'
})

export class ProfileShow {
	private userInfo: IUserInfo = null;		
	
	constructor(private auth: AuthService) {
		this.userInfo = this.auth.getUserProfile();
	}
};