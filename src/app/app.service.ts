import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profile.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/reducers/app.reducer';
import { ProfileData } from '../store/actions/profile.action';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	private PATH = environment.apiPath;

	constructor(
		private http: HttpClient,
		private store: Store<fromApp.AppState>,
		private router: Router
	) {}

	/**
	 *
	 * @param username
	 * @returns Observable with user profile data
	 *
	 */
	getProfile(username: string) {
		return this.http
			.get<{ message: string; data: Profile }>(
				this.PATH + '/auth/profile/' + username
			)
			.subscribe(
				(response) => {
					this.store.dispatch(
						new ProfileData({
							...response.data,
							dob: new Date(
								response.data.dob
							).toLocaleDateString(),
						})
					);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}

	/**
	 *
	 * @description
	 * updates profile (username, dob, email)
	 *
	 */
	updateProfile(data: { email: string; username: string; dob: string }) {
		this.http
			.patch(this.PATH + '/auth/update-profile', {
				newEmail: data.email,
				newDOB: data.dob,
				newUsername: data.username,
			})
			.subscribe(
				() => {},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}
}
