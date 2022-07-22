import { Component, Input, OnInit } from '@angular/core';
import { AvatarService } from '../avatar.service';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit {
  @Input() image_url = '/assets/images/default-avatar.png';
  image_file?: File;

  constructor(private service: AvatarService) {}

  ngOnInit(): void {
    //
  }

  processUpload(upload: HTMLInputElement) {
    if (upload.files) {
      const image = upload.files[0];
      console.log(`Loaded image: ${image.name}`);
      const reader = new FileReader();
      reader.addEventListener('load', (ev: ProgressEvent<FileReader>) => {
        // The load event is fired when a file has been read successfully.
        if (typeof ev.target?.result === 'string') {
          this.image_url = ev.target?.result;
          this.image_file = image;
          this.service.image_file = this.image_file;
        }
      });
      reader.readAsDataURL(image);
    }
  }
}
