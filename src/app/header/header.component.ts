import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducer';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
	authData: { isAuthenticated: boolean; username: string; userId: string };

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		private store: Store<fromApp.AppState>
	) {}

	ngOnInit(): void {
		this.store.select('authorizationData').subscribe(
			(response) => {
				this.authData = response;
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}

	signout() {
		this.authService.signout();
	}
}
