import { Component, Input, OnInit } from '@angular/core';
import { AvatarService } from '../avatar.service';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit {
  @Input() default_src = this.avatar.default_src;

  constructor(public readonly avatar: AvatarService) {}

  ngOnInit(): void {
    if (this.default_src != this.avatar.default_src)
      this.avatar.update({ src: this.default_src });
  }

  processUpload(upload: HTMLInputElement) {
    if (upload.files) {
      const image = upload.files[0];
      console.log(`Loaded image: ${image.name}`);
      this.avatar.update({ file: image });
    }
  }
}
