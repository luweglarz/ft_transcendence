import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { assets } from 'src/assets/assets';
import { AvatarUploadService } from './avatar-upload.service';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit, OnDestroy {
  @Input() default_src = assets.defaultAvatar;

  constructor(public readonly service: AvatarUploadService) {}

  ngOnInit(): void {
    if (this.default_src != this.service.default_src)
      this.service.update({ src: this.default_src });
  }
  ngOnDestroy(): void {
    this.service.clear();
  }

  processInput(upload: HTMLInputElement) {
    if (upload.files) {
      const image = upload.files[0];
      console.log(`Loaded image: ${image.name}`);
      this.service.update({ file: image });
    }
  }
}
