import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { AvatarService } from './avatar.service';
import { AvatarDirective } from './directives/avatar.directive';

@NgModule({
  declarations: [AvatarUploadComponent, AvatarDirective],
  imports: [CommonModule],
  providers: [AvatarService],
  exports: [AvatarUploadComponent, AvatarDirective],
})
export class AvatarModule {}
