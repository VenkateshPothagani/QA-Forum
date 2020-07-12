import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'QA-Site-App';

	constructor(private authService: AuthenticationService) {}

	ngOnInit(): void {
		this.authService.autoAuthentication();
	}
}
