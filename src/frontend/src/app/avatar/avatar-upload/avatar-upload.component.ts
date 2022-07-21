import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit {
  @Input() image_url = '/assets/images/default-avatar.png';

  ngOnInit(): void {
    //
  }
}
