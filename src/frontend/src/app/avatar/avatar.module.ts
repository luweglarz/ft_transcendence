import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

@NgModule({
  declarations: [AvatarUploadComponent],
  imports: [CommonModule],
  exports: [AvatarUploadComponent],
})
export class AvatarModule {}
