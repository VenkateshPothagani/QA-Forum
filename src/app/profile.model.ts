export interface Profile {
	username: string;
	email: string;
	age: { year: number; month: number; day: number };
	dob: string;
	activity: { questions: number; answers: number; comments: number };
}
