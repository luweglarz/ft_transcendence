import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtService } from 'src/app/auth/jwt';
import { ValidatorBuilderService } from 'src/app/auth/signup/validators/validator-builder.service';
import { AvatarUploadService } from 'src/app/avatar/avatar-upload/avatar-upload.service';
import { AvatarService } from 'src/app/avatar/avatar.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  currentAvatar?: string;
  private readonly _requirements = {
    username: [
      Validators.required,
      Validators.maxLength(42),
      Validators.pattern(/^[a-zA-Z0-9]*$/),
    ],
  };
  currentUsername = this.jwt.username;
  username = this.formBuilder.control(this.currentUsername, {
    validators: this._requirements.username,
    asyncValidators: this.validators.isAvailable('username'),
    updateOn: 'change',
  });

  constructor(
    private service: SettingsService,
    public avatarUpload: AvatarUploadService,
    private avatar: AvatarService,
    private jwt: JwtService,
    private formBuilder: FormBuilder,
    private validators: ValidatorBuilderService,
  ) {}

  ngOnInit(): void {
    this.avatar.getSrc(this.jwt.username).subscribe((src) => {
      this.currentAvatar = src;
      this.avatarUpload.update({ src: src });
    });
  }

  updateAvatar() {
    this.avatarUpload.backendUpload();
    this.currentAvatar = this.avatarUpload.src;
  }

  updateUsername() {
    if (this.username.value) this.service.updateUsername(this.username.value);
  }

  ngOnDestroy(): void {
    this.avatarUpload.clear();
  }
}
