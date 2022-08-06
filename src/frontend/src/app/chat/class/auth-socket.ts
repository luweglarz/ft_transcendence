import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/jwt';

@Injectable({
  providedIn: 'root',
})
export class ChatSocket extends Socket {
  constructor(jwtService: JwtService) {
    super({ url: environment.backend, options: { autoConnect: false, path: environment.socketChatPath } });
    this.ioSocket.auth = { token: jwtService.getToken() };
  }
}
