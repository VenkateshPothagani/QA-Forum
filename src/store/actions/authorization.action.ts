import { Action } from '@ngrx/store';
import { Authorization } from 'src/app/authentication/authentication.model';

//Naming conventions CONSTANT =  '[Feature Name] Action Name'
export const AUTHORIZATION_DATA = '[Signin] Authorization Data';

export class AuthorizationData implements Action {
	constructor(public payload: Authorization) {}

	readonly type: string = AUTHORIZATION_DATA;
}


