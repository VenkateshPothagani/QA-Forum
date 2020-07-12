import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformationService } from '../information.service';
import { QueryModel } from '../query/query.model';
import { Model } from '../Types';
import { Store } from '@ngrx/store';
import { Authorization } from 'src/app/authentication/authentication.model';

@Component({
	selector: 'app-comment',
	templateUrl: './comment.component.html',
	styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
	id: string;
	type: Model;
	isEdit: boolean = false;
	comment: QueryModel = null;
	comments: QueryModel[] = [];
	parent: QueryModel;
	authorization: Authorization;
	constructor(
		private activatedRoute: ActivatedRoute,
		private infoService: InformationService,
		private router: Router,
		private store: Store<{ authorizationData: Authorization }>
	) {}

	ngOnInit(): void {
		this.id = this.activatedRoute.snapshot.paramMap.get('id');
		this.type = this.activatedRoute.snapshot.paramMap.get('type') as Model;

		this.store.select('authorizationData').subscribe(
			(response) => {
				this.authorization = response;
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);

		this.infoService.getOne(this.id, this.type).subscribe(
			(response) => {
				this.parent = response.data;
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);

		this.infoService.getAll('comment', this.id).subscribe(
			(response) => {
				this.comments = response.data;
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}

	commentEdit(comment: QueryModel) {
		this.isEdit = !this.isEdit;
		this.comment = comment;
	}

	addUpvote(id: string, model: string) {
		this.infoService
			.addVote({ featureId: id, userId: '' }, model as Model, 'upvote')
			.subscribe(
				(response) => {
					this.updatedComments(response.data.current);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}

	addDownvote(id: string, model: string) {
		this.infoService
			.addVote({ featureId: id, userId: '' }, model as Model, 'downvote')
			.subscribe(
				(response) => {
					this.updatedComments(response.data.current);
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}

	delete(id: string, model: string) {
		this.infoService.delete(id, model as Model).subscribe(
			() => {
				this.comments = this.comments.filter(
					(comment) => comment._id != id
				);
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}

	updatedComments($event: QueryModel) {
		const index = this.comments.findIndex(
			(comment) => comment._id === $event._id
		);
		this.comments[index] = $event;
	}

	addNewComment($event: QueryModel) {
		this.comments.push($event);
	}
}
