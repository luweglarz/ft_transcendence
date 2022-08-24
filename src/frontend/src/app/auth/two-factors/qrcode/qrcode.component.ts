import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { toDataURL } from 'qrcode';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OtpCode } from '../dto';
import { TwoFactorSecret } from '../dto/secret-data.dto';

@Component({
  selector: 'two-factor-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent implements OnInit {
  enabled = this.fb.control<boolean>(false, { nonNullable: true });
  secret?: string;
  codeSrc?: string;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.http
      .get<boolean>(`${environment.backend}/auth/two-factors/is-enabled`)
      .pipe(tap((enabled) => this.enabled.setValue(enabled)))
      .subscribe(() => {
        this.enabled.valueChanges.subscribe((enabled) => {
          if (enabled) {
            this.enable();
          } else {
            this.disable();
          }
        });
      });
  }

  disable() {
    this.secret = undefined;
    this.codeSrc = undefined;
    this.http
      .get(`${environment.backend}/auth/two-factors/disable`)
      .subscribe(() => console.log('2FA disabled'));
  }

  enable() {
    this.http
      .get<TwoFactorSecret>(`${environment.backend}/auth/two-factors/enable`)
      .subscribe((twoFactorData) => {
        console.log('2FA enabled');
        this.secret = twoFactorData.secret;
        this.updateQRCode(twoFactorData.QRCodeData);
      });
  }

  updateQRCode(data: string) {
    toDataURL(data, (err, imageUrl) => {
      if (err) console.error('Could not load QRCode');
      else this.codeSrc = imageUrl;
    });
  }

  logCode(code: OtpCode) {
    console.log(code);
    this.http
      .post(`${environment.backend}/auth/two-factors/verify`, code)
      .subscribe((isValid) => {
        if (isValid) console.log('Code is valid');
        else console.error('Code is invalid');
      });
  }
}
