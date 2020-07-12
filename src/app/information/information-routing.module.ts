import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EditQueryComponent } from './edit-query/edit-query.component';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { AnswerComponent } from './answer/answer.component';
import { CommentComponent } from './comment/comment.component';

const routes: Route[] = [
	{
		path: 'question/add',
		component: EditQueryComponent,
		canActivate: [AuthenticationGuard],
	},
	{
		path: 'question/edit/:id',
		component: EditQueryComponent,
		canActivate: [AuthenticationGuard],
	},

	{
		path: 'answer',
		children: [
			{
				path: ':id',
				component: AnswerComponent,
			},
		],
	},

	{
		path: 'comment',
		children: [
			{
				path: ':type/:id',
				component: CommentComponent,
			},
			{
				path: 'add',
				component: CommentComponent,
				canActivate: [AuthenticationGuard],
			},
			{
				path: 'edit/:id',
				component: CommentComponent,
				canActivate: [AuthenticationGuard],
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthenticationGuard],
})
export class InformationRoutingModule {}
