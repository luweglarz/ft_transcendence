import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [QrcodeComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [QrcodeComponent],
})
export class TwoFactorsModule {}
