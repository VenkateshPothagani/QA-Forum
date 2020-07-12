import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InformationService } from '../information.service';
import { QueryModel } from '../query/query.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-edit-answer',
	templateUrl: './edit-answer.component.html',
	styleUrls: ['./edit-answer.component.css'],
})
export class EditAnswerComponent implements OnInit {
	answerForm: FormGroup;
	isEdit: boolean;

	@Output() answerCreate = new EventEmitter<QueryModel>();
	@Output() answerUpdate = new EventEmitter<QueryModel>();

	@Input() id: string;
	@Input() answer: QueryModel;

	constructor(
		private infoService: InformationService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (this.answer) {
			this.isEdit = true;
			this.id = this.answer._id;
			this.answerForm = new FormGroup({
				description: new FormControl(
					this.answer.description,
					Validators.required
				),
			});
		} else {
			this.isEdit = false;
			this.answerForm = new FormGroup({
				description: new FormControl(null, Validators.required),
			});
		}
	}

	answerSubmit() {
		if (!this.isEdit) {
			const data = {
				id: this.id,
				description: this.answerForm.value.description,
			};
			this.infoService.create(data, 'answer').subscribe(
				(response) => {
					this.answerCreate.next(response.data);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
		} else {
			const data = {
				id: this.id,
				description: this.answerForm.value.description,
			};
			this.infoService.update(data, 'answer').subscribe(
				(response) => {
					this.answerUpdate.next(response.data.current);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
		}
		this.answerForm.reset();
	}
}
