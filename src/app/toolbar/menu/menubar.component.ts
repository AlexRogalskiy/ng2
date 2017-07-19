import { Component, ViewChild, OnInit, Inject, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MdMenuTrigger } from "@angular/material/menu";

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { IMenuItem } from './menu-item.model';

import { IIconModel } from '../icon.model';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../auth/service/auth.service';

/**
 * Created by pavel.antoshenko on 1/30/2017.
 */
@Component({
	selector: 'menu-bar',
	templateUrl: './menubar.component.html',
	styleUrls: ['./menubar.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class MenuBar implements OnInit {
	@ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
	@Output() update: EventEmitter<any> = new EventEmitter<any>();
	
	private itemList: Array<IMenuItem> =
	[
		{ id: 1, label: 'Главная', 			icon: 'home', 		    path: '../assets/icon/main.svg', 		visible: true 							},
		{ id: 2, label: 'Личный кабинет', 	icon: 'user',       	path: '../assets/icon/account.svg', 	visible: true,                  		},
		{ id: 3, label: 'Цветовая схема', 	icon: 'th-large',       path: '../assets/icon/theme.svg', 		visible: true, 		disabled: true		},
		{ id: 4, label: 'Настройки', 		icon: 'cogs',   	    path: '../assets/icon/settings.svg', 	visible: true, 		disabled: true 		},
		{ id: 5, label: 'Справка', 			icon: 'question-circle', path: '../assets/icon/help.svg', 		visible: true, 		disabled: true   	},
		{ id: 6, label: 'Войти', 			icon: 'sign-in',	    path: '../assets/icon/login.svg', 		visible: !this.auth.isAuthenticated() 	},
		{ id: 7, label: 'Выход', 			icon: 'sign-out', 	    path: '../assets/icon/logout.svg', 		visible: this.auth.isAuthenticated() 	},
	];
	
	private iconSet: Array<IIconModel> = [];
	
	constructor(private route: Router, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer, private auth: AuthService) {}
	
	public ngOnInit() : void {
		this.iconSet = this.itemList.map((data: IMenuItem) => { return { label: data.icon, path: data.path }; });
		this.registerIcons(this.iconSet);
	}
	
	public registerIcons(icons: Array<IIconModel>) : void {
		icons.map((data: IIconModel) => { this.mdIconRegistry.addSvgIcon(data.label, this.sanitizer.bypassSecurityTrustResourceUrl(data.path)) });
	}
	
	public openMenuBar() : void {
		this.trigger.openMenu();
	}
	
	public onAction(event, item) : void {
		switch(item.id) {
			case 1:
				this.route.navigate(['']);
				break;
			case 2:
				this.update.emit({text: item});
				break;
			case 6:
				this.update.emit({text: item});
				break;
			case 7:
				this.auth.logout()
				break;
			default:
				break;
		}
	}
}
