import { Routes }     from '@angular/router';
import { ProfileEdit }      from './profile-edit/profile-edit.component';
import { ProfileShow }      from './profile-show/profile-show.component';
import { ProfileComponent } from './profile.component';

export const ProfileRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'edit',  component: ProfileEdit },
      { path: '',     component: ProfileShow }
    ]
  }
];