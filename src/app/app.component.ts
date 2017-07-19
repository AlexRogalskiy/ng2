require('font-awesome/css/font-awesome.css');

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { AuthService } from './auth/service/auth.service';

@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./app.component.css'],
	templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  
	constructor(public appState: AppState, private auth: AuthService) {
		this.auth.handleAuthentication();
	}

	public ngOnInit() {
		console.log('Initial App State', this.appState.state);
	}
	
	public onUpdate(event) : void {
		console.log('onUpdate');
	}
}
