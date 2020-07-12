import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InformationService } from '../information.service';
import { QueryModel } from '../query/query.model';

@Component({
	selector: 'app-edit-query',
	templateUrl: './edit-query.component.html',
	styleUrls: ['./edit-query.component.css'],
})
export class EditQueryComponent implements OnInit {
	title: string = null;
	description: string = null;
	isEdit: boolean = false;

	@Output() questionEdit = new EventEmitter<{
		id: string;
		title: string;
		description: string;
	}>();
	@Input() question: QueryModel;
	@Input() id: string;

	queryForm: FormGroup;
	constructor(
		private infoService: InformationService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (this.question) {
			this.isEdit = true;
			this.queryForm = new FormGroup({
				title: new FormControl(
					this.question.title,
					Validators.required
				),
				description: new FormControl(
					this.question.description,
					Validators.required
				),
			});
		} else {
			this.queryForm = new FormGroup({
				title: new FormControl(null, Validators.required),
				description: new FormControl(null, Validators.required),
			});
		}
	}

	queryData() {
		if (!this.isEdit) {
			const title = this.queryForm.value.title;
			const description = this.queryForm.value.description;

			const data = {
				title,
				description,
			};

			this.infoService.create(data, 'question').subscribe(
				() => {
					this.router.navigate(['/']);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
		} else {
			const title = this.queryForm.value.title;
			const description = this.queryForm.value.description;

			const data = {
				id: this.id,
				title,
				description,
			};

			this.infoService.update(data, 'question').subscribe(
				() => {
					this.isEdit = !this.isEdit;
					this.questionEdit.next(data);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
		}
	}
}
