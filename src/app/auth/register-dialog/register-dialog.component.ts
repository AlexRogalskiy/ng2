import { Component, ElementRef, ViewChild, ViewEncapsulation, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { IUserInfo, UserInfo } from '../user-info.model';

import { AuthService } from '../service/auth.service';

@Component({
	selector: 'register-dialog',
	templateUrl: 'register-dialog.component.html',
	styleUrls: ['register-dialog.component.css']
})
export class RegisterDialog {
	@ViewChild('register') modal: ModalComponent;
	
	@ViewChild('username') username: ElementRef;
	@ViewChild('password') password: ElementRef;
	@ViewChild('repeatPassword') repeatPassword: ElementRef;
	
	private authModalHeaderLabel: string 					= "Регистрация";
	private authModalLoginFieldLabel: string 				= "Логин";
	private authModalPasswordFieldLabel: string 			= "Пароль";
	private authModalPasswordRepeatFieldLabel: string 		= "Повторите пароль";
	private authModalLoginFieldPlaceholder: string 			= "example@example.com";
	private authModalPasswordFieldPlaceholder: string 		= "Пароль";
	private authModalRepeatPasswordFieldPlaceholder: string = "Повторите пароль";
	private authModalRegisterLabel: string 					= "Отправить";
	
	private backdropOptions = [true, false, 'static'];
    private cssClass: string = 'register-dialog';

	private selected: string;
    private output: string;
    private animation: boolean = true;
    private keyboard: boolean = true;
    private backdrop: string | boolean = true;
    private css: boolean = false;
	
	private model: IUserInfo = new UserInfo();
	
	constructor(private router: Router, private http: Http, private auth: AuthService) {}
	
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
	
	public register(event) : void {
		event.preventDefault();
		if(this.password.nativeElement.value !== this.repeatPassword.nativeElement.value) {
			return null;
		}
		this.auth.signup(this.username.nativeElement.value, this.password.nativeElement.value);
	}
}