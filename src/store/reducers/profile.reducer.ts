import * as fromProfile from '../actions/profile.action';

export interface State {
	username: string;
	email: string;
	age: { year: number; month: number; day: number };
	dob: string;
	activity: { questions: number; answers: number; comments: number };
}

const initialState: State = {
	username: null,
	email: null,
	age: { year: null, month: null, day: null },
	dob: null,
	activity: { questions: null, answers: null, comments: null },
};

export const profileReducer = (
	state = initialState,
	action: fromProfile.ProfileAction
) => {
	switch (action.type) {
		case fromProfile.PROFILE_DATA:
			return {
				...state,
				...action.payload,
				dob: new Date(action.payload.dob).toLocaleDateString()
			};

		default:
			return state;
	}
};
