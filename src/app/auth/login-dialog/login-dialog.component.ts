import { Component, ElementRef, ViewChild, ViewEncapsulation, Input, Output, Inject, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { IUserInfo, UserInfo } from '../user-info.model';

import { AuthService } from '../service/auth.service';

@Component({
	selector: 'login-dialog',
	templateUrl: 'login-dialog.component.html',
	styleUrls: ['login-dialog.component.css']
})
export class LoginDialog {
    
	@ViewChild('authorize') modal: ModalComponent;
	
	@ViewChild('username') username: ElementRef;
	@ViewChild('password') password: ElementRef;
	
	@Output() update: EventEmitter<Object> 	= new EventEmitter<Object>();
	
	private authModalHeaderLabel: string 				= "Авторизация";
	private authModalRegisterLabel: string 				= "Регистрация";
	private authModalLoginFieldLabel: string 			= "Логин";
	private authModalPasswordFieldLabel: string 		= "Пароль";
	private authModalLoginFieldPlaceholder: string 		= "example@example.com";
	private authModalPasswordFieldPlaceholder: string 	= "Пароль";
	private authModalLoginLabel: string 				= "Войти";
	private authModalLogoutLabel: string 				= "Выйти";
	
	private backdropOptions = [true, false, 'static'];
    private cssClass: string = 'auth-dialog';

	private selected: string;
    private output: string;
    private animation: boolean = true;
    private keyboard: boolean = true;
    private backdrop: string | boolean = true;
    private css: boolean = false;
	
	private model: IUserInfo = new UserInfo();
	
	constructor(private router: Router, private http: Http, private auth: AuthService) {}
	
	public login(event) : void {
		event.preventDefault();
		this.auth.login(this.username.nativeElement.value, this.password.nativeElement.value);
	}

	public signup(event) : void {
		event.preventDefault();
		this.update.emit({text: event});
	}
	
	public closed() : void {
        this.output = '(closed) ' + this.selected;
    }

    public dismissed() : void {
        this.output = '(dismissed)';
    }

    public opened() : void {
        this.output = '(opened)';
    }

    public navigate() : void {
        this.router.navigate(['/hello']);
    }

    public open() : void {
        this.modal.open();
    }
}