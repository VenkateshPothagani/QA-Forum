import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { CustomValidators } from '../custom-validators';
import { AuthenticationService } from '../authentication.service';
import { UserData } from '../authentication.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
	signupForm: FormGroup;
	getAuthSubscription: Subscription = new Subscription();
	datePattern = new RegExp(
		'((0[0-9])|11|12){1,2}/([0-3][0-9])/([1-2]([0-9]{3}))'
	);

	constructor(
		private authService: AuthenticationService,
		private router: Router	) {}

	ngOnInit(): void {
		this.signupForm = new FormGroup({
			username: new FormControl(
				null,
				[Validators.required, Validators.minLength(6)],
				[this.authService.usernameValidator]
			),
			email: new FormControl(
				null,
				[Validators.required, Validators.email],
				[this.authService.emailValidator]
			),
			passwordGroup: new FormGroup(
				{
					password: new FormControl(null, [
						Validators.required,
						Validators.minLength(8),
					]),
					confirmPassword: new FormControl(null, [
						Validators.required,
						Validators.minLength(8),
					]),
				},
				{ validators: CustomValidators.checkConfirmPassword }
			),
			dob: new FormControl(null, [
				Validators.required,
				Validators.pattern(this.datePattern),
			]),
		});
	}

	signupData(): void {
		const userData: UserData = {
			username: this.signupForm.value.username,
			email: this.signupForm.value.email,
			password: this.signupForm.value.passwordGroup.password,
			dob: this.signupForm.value.dob,
		};
		console.log(this.signupForm);
		this.authService.signup(userData).subscribe(
			() => {},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}



	ngOnDestroy(): void {
		this.getAuthSubscription.unsubscribe();
	}
}
