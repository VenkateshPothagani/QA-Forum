import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
	errorCode: string;
	constructor(private activatedRoute: ActivatedRoute) {}

	ngOnInit(): void {
		this.errorCode = this.activatedRoute.snapshot.paramMap.get(
			'error-code'
		);
	}
}
