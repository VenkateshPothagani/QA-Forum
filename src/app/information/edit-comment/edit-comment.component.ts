import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QueryModel } from '../query/query.model';
import { InformationService } from '../information.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-edit-comment',
	templateUrl: './edit-comment.component.html',
	styleUrls: ['./edit-comment.component.css'],
})
export class EditCommentComponent implements OnInit {
	commentForm: FormGroup;

	isEdit: boolean = false;

	@Output() updateComment = new EventEmitter<QueryModel>();
	@Output() newComments = new EventEmitter<QueryModel>();

	@Input() id: string;
	@Input() comment: QueryModel;

	constructor(
		private infoService: InformationService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (this.comment) {
			this.isEdit = true;
			this.id = this.comment._id;
			this.commentForm = new FormGroup({
				description: new FormControl(
					this.comment.description,
					Validators.required
				),
			});
		} else {
			this.isEdit = false;
			this.commentForm = new FormGroup({
				description: new FormControl(null, Validators.required),
			});
		}
	}

	commentSubmit() {
		if (this.isEdit) {
			const data = {
				id: this.id,
				description: this.commentForm.value.description,
			};

			this.infoService.update(data, 'comment').subscribe(
				(response) => {
					this.updateComment.next(response.data.current);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
		} else {
			this.infoService
				.create(
					{
						id: this.id,
						description: this.commentForm.value.description,
					},
					'comment'
				)
				.subscribe(
					(response) => {
						this.newComments.next(response.data);
					},
					(error) => {
						this.router.navigate(['/error', error.status]);
					}
				);
		}

		this.commentForm.reset();
	}
}
