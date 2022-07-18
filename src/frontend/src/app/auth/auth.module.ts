import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthComponent } from './oauth/oauth.component';
import { JwtService } from './jwt/jwt.service';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, OauthComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SignInComponent, SignUpComponent, OauthComponent],
  providers: [JwtService],
})
export class AuthModule {}
