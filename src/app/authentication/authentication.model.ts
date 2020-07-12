export type CheckUsernameReq = {
	username: string;
};

export type CheckEmailReq = {
	email: string;
};

export interface ValidationRes {
	message: string;
	data: {
		isValid: boolean;
	};
}

export interface SigninResponse {
	userId: string;
	username: string;
}

export interface UserData {
	id?: string;
	username: string;
	email: string;
	password: string;
	date?: string;
	dob: string;
	age?: { year: number; month: number; day: number };
}

export interface Authorization {
	isAuthenticated: boolean;
	username: string;
	userId: string;
}
