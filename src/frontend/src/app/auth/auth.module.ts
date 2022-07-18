import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OauthComponent } from './oauth/oauth.component';
import { JwtService } from './jwt/jwt.service';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, OauthComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [LoginComponent, RegisterComponent, OauthComponent],
  providers: [JwtService],
})
export class AuthModule {}
