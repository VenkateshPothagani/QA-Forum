import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryComponent } from './query/query.component';
import { EditQueryComponent } from './edit-query/edit-query.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InformationRoutingModule } from './information-routing.module';
import { CommentComponent } from './comment/comment.component';
import { AnswerComponent } from './answer/answer.component';
import { EditAnswerComponent } from './edit-answer/edit-answer.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { InformationComponent } from './information.component';

@NgModule({
	declarations: [
		QueryComponent,
		EditQueryComponent,
		CommentComponent,
		AnswerComponent,
		EditAnswerComponent,
		EditCommentComponent,
		InformationComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, InformationRoutingModule],
})
export class InformationModule {}
