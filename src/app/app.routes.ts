import { Routes } from "@angular/router";
import { Events } from "./events/events.component";
import { Event } from "./events/event/event.component";
import { NoContentComponent } from "./no-content";

import { MainAuthComponent } from './auth/main/main.component';
//import { Signup } from './auth/signup.component';
import { AuthGuard } from './auth/service/auth-guard.service';

export const ROUTES: Routes = [
	{ path: '', 			component: Events },
	//{ path: 'login', 		component: Login },
	{ path: 'event/:id', 	component: Event },
	//{ path: 'signup', 		component: Signup },
	{ path: 'home',   		component: MainAuthComponent, canActivate: [AuthGuard] },
	{ path: '**', 			component: NoContentComponent },
];
