import { Component, OnInit } from '@angular/core';
import { InformationService } from '../information.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryModel } from '../query/query.model';
import { Model } from '../Types';
import { Store } from '@ngrx/store';
import { Authorization } from 'src/app/authentication/authentication.model';

@Component({
	selector: 'app-answer',
	templateUrl: './answer.component.html',
	styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
	id: string;
	question: QueryModel;
	answers: QueryModel[] = [];
	sendAnswer: QueryModel;
	isEdit = false;
	status = false;
	message: string;
	isQuestionEdit = false;
	authorization: Authorization;
	constructor(
		private infoService: InformationService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private store: Store<{ authorizationData: Authorization }>
	) {}

	ngOnInit(): void {
		// gets data from store
		this.store.select('authorizationData').subscribe((response) => {
			this.authorization = response;
		});

		this.id = this.activatedRoute.snapshot.paramMap.get('id');
		this.infoService.getOne(this.id, 'question').subscribe((response) => {
			this.question = response.data;
		},
		(error) => {
			this.router.navigate(['/error', error.status]);
		});

		this.infoService.getAll('answer', this.id).subscribe((response) => {
			this.answers = response.data;
		},
		(error) => {
			this.router.navigate(['/error', error.status]);
		});
	}

	toggleQuestion($event: QueryModel) {
		this.isQuestionEdit = false;
		this.question = { ...this.question, ...$event };
	}

	questionEdit() {
		this.isQuestionEdit = !this.isQuestionEdit;
	}

	answerEdit(answer: QueryModel) {
		this.isEdit = !this.isEdit;
		this.sendAnswer = answer;
	}

	addUpvote(id: string, model: string) {
		this.infoService
			.addVote(
				{ featureId: id, userId: this.authorization.userId },
				model as Model,
				'upvote'
			)
			.subscribe(
				(response) => {
					if (model === 'answer') {
						this.updatedAnswer(response.data.current);
					} else {
						this.toggleQuestion(response.data.current);
					}
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}

	addDownvote(id: string, model: string) {
		this.infoService
			.addVote(
				{ featureId: id, userId: this.authorization.userId },
				model as Model,
				'downvote'
			)
			.subscribe(
				(response) => {
					if (model === 'answer') {
						this.updatedAnswer(response.data.current);
					} else {
						this.toggleQuestion(response.data.current);
					}
				},
				(error) => {
					this.router.navigate(['/error', error.status]);
				}
			);
	}

	delete(id: string, model: string) {
		this.infoService.delete(id, model as Model).subscribe(
			() => {
				if (model === 'answer') {
					this.answers = this.answers.filter(
						(answer) => answer._id != id
					);
				} else {
					this.router.navigate(['/']);
				}
			},
			(error) => {
				this.router.navigate(['/error', error.status]);
			}
		);
	}

	newAnswers($event: QueryModel) {
		this.answers.push($event);
	}

	updatedAnswer($event: QueryModel) {
		const index = this.answers.findIndex(
			(answer) => answer._id === $event._id
		);
		this.answers[index] = $event;
	}
}
