import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
	constructor(private authService: AuthenticationService) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.authService.getToken();

		req = req.clone({
			headers: req.headers.set('Authorization', 'Bearer ' + token),
		});

		return next.handle(req);
	}
}
