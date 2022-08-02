import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { SignUpComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'src/app/avatar';

@NgModule({
  declarations: [SignUpComponent, SelectComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AvatarModule,
    ReactiveFormsModule,
  ],
  exports: [SignUpComponent],
})
export class SignupModule {}
