import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { AvatarUploadService } from './avatar-upload/avatar-upload.service';

@NgModule({
  declarations: [AvatarUploadComponent],
  imports: [CommonModule],
  providers: [AvatarUploadService],
  exports: [AvatarUploadComponent],
})
export class AvatarModule {}
