import { Component, OnInit } from '@angular/core';
import { InformationService } from '../information.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { QueryModel } from './query.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.css'],
})
export class QueryComponent implements OnInit {
	isAuthenticated = false;
	userInfo: any;
	queries: QueryModel[];

	constructor(
		private authService: AuthenticationService,
		private infoService: InformationService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.isAuthenticated = this.authService.getIsAuthenticated();

		this.infoService.getAll('question').subscribe(
			(response) => {
				this.queries = response.data;
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}
}
