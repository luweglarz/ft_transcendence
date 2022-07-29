import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin';
import { SignUpComponent } from './signup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthCallbackComponent } from './oauth';
import { SignOutComponent } from './signout/signout.component';
import { RouterModule } from '@angular/router';
import { InfoComponent } from './info';
import { AvatarModule } from '../avatar';
import { JwtModule } from './jwt';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
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
    JwtModule,
  ],
  exports: [SignInComponent, SignUpComponent, OauthCallbackComponent],
})
export class AuthModule {}
