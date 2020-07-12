import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(
		private authService: AuthenticationService,
		private router: Router
	) {}

	canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	):
		| boolean
		| import('@angular/router').UrlTree
		| import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
		| Promise<boolean | import('@angular/router').UrlTree> {
		const isAuthenticated = this.authService.getIsAuthenticated();

		if (!isAuthenticated) {
			this.router.navigate(['auth/signin']);
		}

		return isAuthenticated;
	}
}
