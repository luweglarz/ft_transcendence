import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin';
import { SignUpComponent } from './signup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthComponent } from './oauth';
import { JwtService } from './jwt';
import { SignOutComponent } from './signout/signout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    OauthComponent,
    SignOutComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [SignInComponent, SignUpComponent, OauthComponent],
  providers: [JwtService],
})
export class AuthModule {}
