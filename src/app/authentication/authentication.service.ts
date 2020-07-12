import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { ValidationErrors, FormControl } from '@angular/forms';
import { map, tap, catchError } from 'rxjs/operators';
import {
	CheckUsernameReq,
	CheckEmailReq,
	ValidationRes,
	UserData,
	SigninResponse,
	Authorization,
} from './authentication.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthorizationData } from 'src/store/actions/authorization.action';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private PATH = environment.apiPath + '/auth';
	private EXPIRES_IN = 3600;

	private token: string;
	private isAuthenticated: boolean = false;
	private tokenTimer: any;

	private authenticationStatus: Subject<boolean> = new Subject();
	private signinInfo: Subject<SigninResponse> = new Subject();

	constructor(
		private http: HttpClient,
		private router: Router,
		private store: Store<{ authorizationData: Authorization }>
	) {}

	/**
	 * @param token token from serve for authentication
	 * @param expiresIn token expiration time
	 * @description
	 * saves token and it's expiration date in localstorage
	 */
	private saveAuthenticationData = (
		token: string,
		expiresIn: Date,
		username: string,
		userId: string
	) => {
		localStorage.setItem('token', token);
		localStorage.setItem('expiresIn', expiresIn.toISOString());
		localStorage.setItem('username', username);
		localStorage.setItem('userId', userId);
	};

	/**
	 * @description
	 * takes authentication data from localstorage
	 */
	private getAuthenticationData = () => {
		const token = localStorage.getItem('token');
		const expiresIn = localStorage.getItem('expiresIn');
		const username = localStorage.getItem('username');
		const userId = localStorage.getItem('userId');
		if (!token || !expiresIn || !username || !userId) {
			return;
		}

		this.store.dispatch(
			new AuthorizationData({
				isAuthenticated: true,
				username: username,
				userId: userId,
			})
		);

		return {
			token: token,
			expiresIn: new Date(expiresIn),
			username,
			userId,
		};
	};

	/**
	 * @description
	 * clears token and it's expiration date in localstorage
	 */
	private clearAuthenticationData = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('expiresIn');
		localStorage.removeItem('username');
		localStorage.removeItem('userId');

		this.store.dispatch(
			new AuthorizationData({
				isAuthenticated: false,
				username: undefined,
				userId: undefined,
			})
		);
	};

	/**
	 *
	 * @param duration time in seconds
	 * restarts new timer based current time - last login time
	 */
	private setAuthenticationTimer = (duration: number) => {
		this.tokenTimer = setTimeout(() => {
			this.signout();
		}, duration * 1000);
	};

	autoAuthentication = () => {
		const authenticationInfo = this.getAuthenticationData();

		if (authenticationInfo) {
			const expiresIn =
				authenticationInfo.expiresIn.getTime() - new Date().getTime();

			if (expiresIn > 0) {
				this.token = authenticationInfo.token;

				this.signinInfo.next({
					username: authenticationInfo.username,
					userId: authenticationInfo.userId,
				});

				this.isAuthenticated = true;
				this.authenticationStatus.next(true);

				this.setAuthenticationTimer(expiresIn / 1000);
			}
		}
	};

	/**
	 *
	 * @param data data is object with username
	 * @returns validation result
	 * @description
	 * Checks given username is valid (not duplicate) are not
	 * Need to subscribe to get result otherwise the request can't send to server
	 */
	getUsername = (data: CheckUsernameReq) => {
		return this.http.post<ValidationRes>(
			this.PATH + '/check-username',
			data
		);
	};

	/**
	 *
	 * @param data data is object email
	 * @returns Observable with validation result
	 * @description
	 * Checks given email is valid (not duplicate) are not.
	 * Need to subscribe to get result otherwise the request can't send to server
	 */
	getEmail = (data: CheckEmailReq) => {
		return this.http.post<ValidationRes>(this.PATH + '/check-email', data);
	};

	/**
	 *
	 * @param control FromControl passed by angular itself
	 * @returns ValidationErrors object if email is duplicate
	 * @description
	 * check the control value (user enter value) is already stored
	 * in db or not, to avoid duplicate email (email must be unique)
	 */
	emailValidator = (
		control: FormControl
	): Observable<ValidationErrors | null> => {
		const data: CheckEmailReq = { email: control.value };

		return this.getEmail(data).pipe(
			map((result) => {
				if (result.data.isValid) {
					return null;
				}
				return { duplicateEmail: true };
			})
		);
	};

	/**
	 *
	 * @param control FromControl passed by angular itself
	 * @returns ValidationErrors object if email is duplicate
	 * @description
	 * check the control value (user enter value) is already stored
	 * in db or not, to avoid duplicate username (username must be unique)
	 */
	usernameValidator = (
		control: FormControl
	): Observable<ValidationErrors | null> => {
		const data: CheckUsernameReq = { username: control.value };

		return this.getUsername(data).pipe(
			map((result) => {
				if (result.data.isValid) {
					return null;
				}

				return {
					duplicateUsername: true,
				};
			})
		);
	};

	/**
	 *
	 * @param data form data
	 * @description
	 * On successful  response, redirects to signin page otherwise
	 * raise an event with error object
	 *
	 *  BAD PRACTICE Signup
	 *  GOOD PRACTICE Signin
	 */
	// signup = (data: UserData) => {
	// 	this.http
	// 		.post<{ message: string; data: UserData }>(
	// 			this.PATH + '/signup',
	// 			data
	// 		)
	// 		.subscribe(() => {
	// 			this.router.navigate(['/auth/signin']);
	// 		});
	// };

	signup = (data: UserData) => {
		return this.http
			.post<{ message: string; data: UserData }>(
				this.PATH + '/signup',
				data
			)
			.pipe(
				catchError((error) => throwError(error)),
				tap(() => {
					this.router.navigate(['/auth/signin']);
				})
			);
	};

	/**
	 *
	 * @param data form data
	 * @description
	 * On successful response, redirects to home page otherwise
	 * raise an event with error object
	 *
	 * GOOD PRACTICE
	 * BAD PRACTICE Signup
	 */
	signin = (data: { username: string; password: string }) => {
		return this.http
			.post<{
				message: string;
				data: {
					token: string;
					username: string;
					userId: string;
				};
			}>(this.PATH + '/signin', data)
			.pipe(
				catchError((error) => throwError(error)),
				tap((response) => {
					this.store.dispatch(
						new AuthorizationData({
							isAuthenticated: true,
							username: response.data.username,
							userId: response.data.userId,
						})
					);

					// dispatches data when user is logged in

					this.token = response.data.token;

					// if (response) {
					// 	this.signinInfo.next(response.data);
					// }

					if (this.token) {
						this.isAuthenticated = true;
						this.authenticationStatus.next(true);

						const now = new Date();
						const expiresIn = new Date(
							now.getTime() + this.EXPIRES_IN * 1000
						);

						this.saveAuthenticationData(
							this.token,
							expiresIn,
							response.data.username,
							response.data.userId
						);

						this.setAuthenticationTimer(this.EXPIRES_IN);

						this.router.navigate(['']);
					}
				})
			);
	};

	/**
	 * @description
	 * After user logout it clears local storage and change auth status and
	 * redirects to home page
	 */
	signout() {
		this.token = null;
		this.signinInfo = null;
		this.isAuthenticated = false;
		this.authenticationStatus.next(false);
		clearTimeout(this.tokenTimer);
		this.clearAuthenticationData();

		this.store.dispatch(
			new AuthorizationData({
				isAuthenticated: false,
				username: undefined,
				userId: undefined,
			})
		);

		this.router.navigate(['']);
	}

	/**
	 * @returns JWT token
	 */
	getToken() {
		return this.token;
	}

	/**
	 * @returns authenticationStatus as Observable
	 */
	getAuthenticationStatus() {
		return this.authenticationStatus.asObservable();
	}

	/**
	 * @returns signin response data as Observable
	 */
	getSigninInfo() {
		return this.signinInfo?.asObservable();
	}

	/**
	 * @description
	 * returns true if user  is Authenticated
	 */
	getIsAuthenticated() {
		return this.isAuthenticated;
	}
}
