// Import all reducers
import * as fromAuthorization from './authorization.reducer';
import * as fromProfile from './profile.reducer'

import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
	authorizationData: fromAuthorization.State;
	profileData: fromProfile.State
}

export const appReducer: ActionReducerMap<AppState> = {
	authorizationData: fromAuthorization.authorizationDataReducer,
	profileData: fromProfile.profileReducer
};
