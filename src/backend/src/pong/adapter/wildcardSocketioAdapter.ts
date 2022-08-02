import { IoAdapter } from '@nestjs/platform-socket.io';
import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import wildcard from 'socketio-wildcard';

export default class WildcardsIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    server.use(wildcard(EventEmitter));
    return server;
  }
}
