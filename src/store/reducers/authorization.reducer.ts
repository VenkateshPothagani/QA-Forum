import * as AuthorizationActions from '../actions/authorization.action';

export interface State {
	isAuthenticated: boolean;
	userId: string;
	username: string;
}

const initialState: State = {
	isAuthenticated: undefined,
	userId: undefined,
	username: undefined,
};

export const authorizationDataReducer = (
	state = initialState,
	action: AuthorizationActions.AuthorizationData
) => {
	switch (action.type) {
		case AuthorizationActions.AUTHORIZATION_DATA:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};