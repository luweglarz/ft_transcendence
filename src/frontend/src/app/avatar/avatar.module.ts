import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { AvatarService } from './avatar.service';

@NgModule({
  declarations: [AvatarUploadComponent],
  imports: [CommonModule],
  providers: [AvatarService],
  exports: [AvatarUploadComponent],
})
export class AvatarModule {}
