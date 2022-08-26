import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OtpCode } from '../dto';

@Component({
  selector: 'otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.css'],
})
export class OtpInputComponent implements OnInit {
  @Output() codeCompleted = new EventEmitter();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }
  emitCode(code: string) {
    const otpDto: OtpCode = { code: code };
    this.codeCompleted.emit(otpDto);
  }
}
