import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
	signinForm: FormGroup;
	getAuthSubscription: Subscription = new Subscription();
	error = false;

	constructor(
		private authService: AuthenticationService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.signinForm = new FormGroup({
			username: new FormControl(null, [Validators.required]),
			password: new FormControl(null, [Validators.required]),
		});
	}

	signinData(): void {
		const data: { username: string; password: string } = {
			username: this.signinForm.value.username,
			password: this.signinForm.value.password,
		};

		this.authService.signin(data).subscribe(
			(response) => {},
			(error) => {
				if (error.status == '401') {
					this.error = !this.error;
				} else {
					this.router.navigate(['/error', error.status]);
				}
			}
		);
	}

	ngOnDestroy() {
		this.getAuthSubscription.unsubscribe();
	}
}
