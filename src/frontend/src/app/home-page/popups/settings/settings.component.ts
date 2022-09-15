import { Component, OnInit } from '@angular/core';
import { AvatarUploadService } from 'src/app/avatar/avatar-upload/avatar-upload.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor(public avatar: AvatarUploadService) {}

  ngOnInit(): void {
    //
  }
}
