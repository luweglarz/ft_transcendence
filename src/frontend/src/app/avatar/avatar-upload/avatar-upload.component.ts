import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { assets } from 'src/assets/assets';
import { AvatarService } from '../avatar.service';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit, OnDestroy {
  @Input() default_src = assets.defaultAvatar;

  constructor(public readonly avatar: AvatarService) {}

  ngOnInit(): void {
    if (this.default_src != this.avatar.default_src)
      this.avatar.update({ src: this.default_src });
  }
  ngOnDestroy(): void {
    this.avatar.clear();
  }

  processUpload(upload: HTMLInputElement) {
    if (upload.files) {
      const image = upload.files[0];
      console.log(`Loaded image: ${image.name}`);
      this.avatar.update({ file: image });
    }
  }
}
