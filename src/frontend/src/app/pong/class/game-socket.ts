import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameSocket extends Socket {
  constructor(jwtService: JwtService) {
    super({
      url: environment.backend,
      options: { autoConnect: false, path: environment.socketGamePath },
    });
    this.ioSocket.auth = { token: jwtService.getToken() };
  }
}
