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
  error = '';

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
      if (image.size > 10 * 1000 * 1000) {
        this.error = 'Image to large: max size 10Mb';
      } else {
        this.error = '';
        // console.debug(`Loaded image: ${image.name}`);
        this.service.update({ file: image });
      }
    }
  }
}
