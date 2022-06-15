import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PongComponent } from './pong.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};
@NgModule({
  declarations: [
    PongComponent,
  ],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config)
  ],
})
export class PongModule { }