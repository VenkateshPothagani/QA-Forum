import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { Profile } from '../profile.model';
import { AuthenticationService } from '../authentication/authentication.service';
import { Store } from '@ngrx/store';
import { Authorization } from '../authentication/authentication.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as fromApp from '../../store/reducers/app.reducer';
import * as profileActions from '../../store/actions/profile.action';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
	data: Profile = {
		username: null,
		email: null,
		age: { year: null, month: null, day: null },
		dob: null,
		activity: { questions: null, answers: null, comments: null },
	};
	authorization: Authorization;
	profileUpdateForm: FormGroup;
	username: string;

	constructor(
		private route: ActivatedRoute,
		private appService: AppService,
		private store: Store<fromApp.AppState>
	) {}

	ngOnInit(): void {
		this.username = this.route.snapshot.paramMap.get('username');

		this.store.dispatch(
			new profileActions.GetProfile({ username: this.username })
		);

		this.store.select('authorizationData').subscribe((response) => {
			this.authorization = response;
		});

		this.profileUpdateForm = new FormGroup({
			username: new FormControl(
				{
					value: null,
					disabled: !this.authorization.isAuthenticated,
				},
				Validators.required
			),
			email: new FormControl(
				{
					value: null,
					disabled: !this.authorization.isAuthenticated,
				},
				Validators.required
			),
			dob: new FormControl(
				{
					value: null,
					disabled: !this.authorization.isAuthenticated,
				},
				Validators.required
			),
		});

		this.store.select('profileData').subscribe((response) => {
			this.data = response;
			this.profileUpdateForm.setValue({
				username: this.data.username,
				email: this.data.email,
				dob: this.data.dob,
			});
		});
	}

	updateProfile(): void {
		const username = this.profileUpdateForm.value.username;
		const email = this.profileUpdateForm.value.email;
		const dob = this.profileUpdateForm.value.dob;

		this.appService.updateProfile({ email, username, dob });
	}
}
