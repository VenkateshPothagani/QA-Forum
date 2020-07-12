import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { QueryModel } from './query/query.model';
import { Model, Vote } from './Types';

@Injectable({
	providedIn: 'root',
})
export class InformationService {
	private PATH = 'http://localhost:3000/api/info';

	constructor(private http: HttpClient) {}

	/**
	 *
	 * @param data
	 * @param modelType
	 * @description
	 * creates a document
	 */
	create = (
		data: { id?: string; title?: string; description: string },
		modelType: Model
	) => {
		return this.http.post<{ message: string; data: QueryModel }>(
			this.PATH + '/' + modelType + '/' + '/create',
			data
		);
	};

	/**
	 *
	 * @param modelType
	 * @description
	 * gets all documents from specified model
	 */
	getAll = (modelType: Model, id?: string) => {
		if (!id) {
			return this.http.get<{ message: string; data: QueryModel[] }>(
				this.PATH + '/' + modelType + '/get-all'
			);
		} else {
			return this.http.get<{ message: string; data: QueryModel[] }>(
				this.PATH + '/' + modelType + '/get-all/' + id
			);
		}
	};

	/**
	 *
	 * @param id document id
	 * @param modelType
	 * @description
	 * gets single document of id from specified model
	 */
	getOne = (id: string, modelType: Model) => {
		return this.http.get<{ message: string; data: QueryModel }>(
			this.PATH + '/' + modelType + '/get-one/' + id
		);
	};

	/**
	 *
	 * @param data only question required title
	 * @param modelType
	 * @description
	 * update document with given data
	 */
	update = (
		data: {
			id: string;
			title?: string;
			description: string;
		},
		modelType: Model
	) => {
		return this.http.patch<{
			message: string;
			data: { current: QueryModel; previous: QueryModel };
		}>(this.PATH + '/' + modelType + '/update', data);
	};

	/**
	 *
	 * @param data document Id
	 * @param modelType
	 * @description
	 * removes a document of given id
	 */
	delete = (id: string, modelType: Model) => {
		return this.http.delete(this.PATH + '/' + modelType + '/remove/' + id);
	};

	/**
	 *
	 * @param data object with id(featureId)
	 * @param modelType
	 * @param voteType upvote or downvote
	 * @description
	 * adds/remove upvote or downvote of given document
	 */
	addVote = (
		data: { featureId: string; userId: string },
		modelType: Model,
		voteType: Vote
	) => {
		return this.http.post<{
			message: string;
			data: { current: QueryModel; previous: QueryModel };
		}>(this.PATH + '/' + modelType + '/' + voteType, data);
	};
}
