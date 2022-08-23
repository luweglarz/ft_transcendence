import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthCallbackComponent } from './oauth';
import { SignOutComponent } from './signout/signout.component';
import { RouterModule } from '@angular/router';
import { InfoComponent } from './info';
import { AvatarModule } from '../avatar';
import { SignupModule } from './signup/signup.module';
import { TwoFactorsModule } from './two-factors/two-factors.module';

@NgModule({
  declarations: [
    SignInComponent,
    OauthCallbackComponent,
    SignOutComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
    SignupModule,
    TwoFactorsModule,
  ],
  exports: [SignInComponent, OauthCallbackComponent],
})
export class AuthModule {}
