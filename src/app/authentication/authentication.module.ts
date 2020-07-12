import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationInterceptor } from './authentication-interceptor';

@NgModule({
	declarations: [SignupComponent, SigninComponent],
	imports: [
		CommonModule,
		AuthenticationRoutingModule,
		ReactiveFormsModule,
		HttpClientModule,
	],
	providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}]
})
export class AuthenticationModule {}
