import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthenticationGuard } from './authentication.guard';

const routes: Routes = [
	{ path: 'auth/signin', component: SigninComponent },
	{ path: 'auth/signup', component: SignupComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthenticationGuard],
})
export class AuthenticationRoutingModule {}
