import { IoAdapter } from '@nestjs/platform-socket.io';
import { EventEmitter } from 'events';
import { Server } from 'socket.io';

const sioWildcard = require('socketio-wildcard');
export default class WildcardsIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    server.use(sioWildcard(EventEmitter));
    return server;
  }
}
