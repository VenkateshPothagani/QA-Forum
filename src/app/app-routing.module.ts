import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { QueryComponent } from './information/query/query.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
	{ path: '', component: QueryComponent },
	{ path: 'profile/:username', component: ProfileComponent },
	{ path: 'error/:error-code', component: ErrorComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [],
})
export class AppRoutingModule {}
