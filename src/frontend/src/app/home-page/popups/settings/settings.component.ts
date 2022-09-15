import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarUploadService } from 'src/app/avatar/avatar-upload/avatar-upload.service';
import { AvatarService } from 'src/app/avatar/avatar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  currentAvatar?: string;
  uploadButton = false;

  constructor(
    public avatarUpload: AvatarUploadService,
    private avatar: AvatarService,
    private jwt: JwtService,
  ) {}

  ngOnInit(): void {
    this.avatar.getSrc(this.jwt.username).subscribe((src) => {
      this.currentAvatar = src;
      this.avatarUpload.update({ src: src });
    });
  }

  update() {
    this.avatarUpload.backendUpload();
    this.currentAvatar = this.avatarUpload.src;
  }

  ngOnDestroy(): void {
    this.avatarUpload.clear();
  }
}
