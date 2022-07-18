import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin';
import { SignUpComponent } from './signup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthComponent } from './oauth';
import { JwtService } from './jwt';
import { SignOutComponent } from './signout/signout.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    OauthComponent,
    SignOutComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SignInComponent, SignUpComponent, OauthComponent],
  providers: [JwtService],
})
export class AuthModule {}
