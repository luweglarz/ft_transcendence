import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { OtpInputComponent } from './otp-input/otp-input.component';

@NgModule({
  declarations: [QrcodeComponent, OtpInputComponent],
  imports: [CommonModule, ReactiveFormsModule, CodeInputModule],
  exports: [QrcodeComponent, OtpInputComponent],
})
export class TwoFactorsModule {}
