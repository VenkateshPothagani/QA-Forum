import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidators {
	static checkConfirmPassword = (group: FormGroup): ValidationErrors => {
		const password = group.get('password');
		const confirmPassword = group.get('confirmPassword');

		if (password?.value === confirmPassword?.value) {
			return null;
		}

		return { passwordMismatch: true };
	};
}
