import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
	name: 'format',
})
export class FormatPipe implements PipeTransform {
	transform(value: string, ...args: any[]) {
		if (value.length > 50) {
			return value.substr(0, 50) + '.....';
		}
		return value;
	}
}
