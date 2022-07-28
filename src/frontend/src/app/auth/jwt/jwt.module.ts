import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from './jwt.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [JwtService],
})
export class JwtModule {}
