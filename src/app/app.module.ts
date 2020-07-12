import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProfileComponent } from './profile/profile.component';
import { InformationModule } from './information/information.module';
import { FormatPipe } from './format.pipe';
import { ErrorComponent } from './error/error.component';
import { ProfileEffect } from '../store/effects/profile.effect';
import * as fromApp from '../store/reducers/app.reducer';
import { environment } from 'src/environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		ProfileComponent,
		FormatPipe,
		ErrorComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AuthenticationModule,
		ReactiveFormsModule,
		InformationModule,
		StoreModule.forRoot(fromApp.appReducer),
		EffectsModule.forRoot([ProfileEffect]),
		StoreDevtoolsModule.instrument({ logOnly: environment.production }),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
