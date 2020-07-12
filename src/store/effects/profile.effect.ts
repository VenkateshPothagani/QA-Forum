import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as ProfileActions from '../actions/profile.action';
import { Profile } from '../../app/profile.model';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileEffect {
	private PATH = environment.apiPath;
	constructor(private actions$: Actions, private http: HttpClient) {}

	@Effect()
	getProfile = this.actions$.pipe(
		ofType(ProfileActions.GET_PROFILE),

		switchMap((profileName: ProfileActions.GetProfile) => {
			return this.http
				.get<{ message: string; data: Profile }>(
					this.PATH + '/auth/profile/' + profileName.payload.username
				)
				.pipe(
					map((response) => {
						console.log(response);
						return new ProfileActions.ProfileData(response.data);
					}),
					catchError((error) => {
						return of();
					})
				);
		})
	);
}
