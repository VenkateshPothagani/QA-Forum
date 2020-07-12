import { Action } from '@ngrx/store';

export const PROFILE_DATA = '[Profile] Profile Data';
export const GET_PROFILE = '[Profile] Get Profile';

export interface State {
	username: string;
	email: string;
	age: { year: number; month: number; day: number };
	dob: string;
	activity: { questions: number; answers: number; comments: number };
}

export class ProfileData implements Action {
	readonly type: string = PROFILE_DATA;

	constructor(public payload: State) {}
}

export class GetProfile implements Action {
	readonly type: string = GET_PROFILE;

	constructor(public payload: { username: string }) {}
}

export type ProfileAction = ProfileData;
