import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin';
import { SignUpComponent } from './signup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthComponent } from './oauth';
import { JwtService } from './jwt';
import { SignOutComponent } from './signout/signout.component';
import { RouterModule } from '@angular/router';
import { OAuthService } from './oauth/oauth.service';
import { InfoComponent } from './info/info.component';
import { AvatarModule } from '../avatar/avatar.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    OauthComponent,
    SignOutComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
  ],
  exports: [SignInComponent, SignUpComponent, OauthComponent],
  providers: [JwtService, OAuthService],
})
export class AuthModule {}
