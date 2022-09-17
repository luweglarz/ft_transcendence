import { forwardRef, Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { MatchmakingGatewayService } from 'src/pong/gateway/matchmaking/matchmaking-gateway.service';

@WebSocketGateway({ cors: true, path: '/status' })
export class FriendsStatusGateway {
  constructor(
    private jwtService: JwtAuthService,
    @Inject(forwardRef(() => MatchmakingGatewayService))
    private matchmakingGatewayService: MatchmakingGatewayService,
  ) {
    this.logger = new Logger('FriendsStatus');
    this.onlineUsers = new Map<string, Socket[]>();
  }

  private logger: Logger;
  public onlineUsers: Map<string, Socket[]>;

  afterInit() {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    try {
      this.jwtService.verifyAccessToken(client.handshake.auth.token);
      this.logger.log(`Client connected: ${client.id}`);
      const username: string = JSON.parse(
        JSON.stringify(this.jwtService.decode(client.handshake.auth.token)),
      ).username;
      this.onlineUsers.set(username, new Array<Socket>(client));
      for (const [key, value] of this.onlineUsers) {
        if (this.matchmakingGatewayService.isUserInGame(key) === true)
          client.emit('inGame', key);
        else client.emit('online', key);
        for (const socket of value) {
          if (this.matchmakingGatewayService.isUserInGame(username) === true)
            socket.emit('inGame', username);
          else socket.emit('online', username);
        }
      }
    } catch (error) {
      this.logger.debug(error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const username: string = JSON.parse(
      JSON.stringify(this.jwtService.decode(client.handshake.auth.token)),
    ).username;
    this.onlineUsers.get(username).splice(
      this.onlineUsers
        .get(username)
        .findIndex((element) => element.id === client.id),
      1,
    );
    try {
      if (this.onlineUsers.get(username).length === 0) {
        for (const [key, value] of this.onlineUsers) {
          key;
          for (const socket of value) {
            socket.emit('offline', username);
          }
        }
        this.onlineUsers.delete(username);
      }
    } catch (error) {
      this.logger.debug(error);
      client.disconnect();
    }
  }

  emitInGameStatus(player1: string, player2: string) {
    try {
      for (const [key, value] of this.onlineUsers) {
        if (this.matchmakingGatewayService.isUserInGame(key) === true)
          for (const socket of value) {
            socket.emit('inGame', player1);
            socket.emit('inGame', player2);
          }
      }
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
