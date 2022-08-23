import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { toDataURL } from 'qrcode';
import { environment } from 'src/environments/environment';
import { TwoFactorSecret } from '../dto/secret-data.dto';

@Component({
  selector: 'two-factor-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent implements OnInit {
  data?: TwoFactorSecret;
  enabled = this.fb.control<boolean>(false, { nonNullable: true });
  codeSrc?: string;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enabled.valueChanges.subscribe((enabled) => {
      if (enabled) {
        this.enable();
      } else {
        this.disable();
      }
    });
  }

  disable() {
    this.codeSrc = undefined;
    console.log('2FA disabled');
    // TODO: disable in db
  }

  enable() {
    this.http
      .get<TwoFactorSecret>(
        `${environment.backend}/auth/two-factors/generate-secret`,
      )
      .subscribe((twoFactorData) => {
        this.data = twoFactorData;
        console.log('2FA enabled');
        this.updateQRCode();
      });
  }

  updateQRCode() {
    if (this.data) {
      toDataURL(this.data.QRCodeData, (err, imageUrl) => {
        if (err) console.error('Could not load QRCode');
        else this.codeSrc = imageUrl;
      });
    }
  }
}
