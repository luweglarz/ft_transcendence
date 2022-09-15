import { forwardRef, Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/modules/jwt/jwt-auth.service';
import { Player } from 'src/pong/class/player/player';
import { SocialService } from '../social.service';

@WebSocketGateway({ cors: true, path: '/status' })
export class FriendsStatusGateway {
  constructor(
    private jwtService: JwtAuthService,
    @Inject(forwardRef(() => SocialService))
    private socialService: SocialService,
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
      this.jwtService.verifyAccessToken(client.handshake.auth.token, 'sync');
      const username: string = JSON.parse(
        JSON.stringify(this.jwtService.decode(client.handshake.auth.token)),
      ).username;
      if (this.onlineUsers.has(username))
        this.onlineUsers.get(username).push(client);
      else this.onlineUsers.set(username, new Array<Socket>(client));
      const friends = await this.socialService.getUserFriends(username);
      for (const [key, value] of this.onlineUsers) {
        for (const friend of friends) {
          if (friend.targetName === key) {
            client.emit('online', friend.targetName);
            for (const socket of value) {
              socket.emit('online', username);
            }
          }
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
    const friends = await this.socialService.getUserFriends(username);
    this.onlineUsers.get(username).splice(
      this.onlineUsers
        .get(username)
        .findIndex((element) => element.id === client.id),
      1,
    );
    try {
      if (this.onlineUsers.get(username).length === 0) {
        for (const [key, value] of this.onlineUsers) {
          for (const friend of friends) {
            if (friend.targetName === key) {
              for (const socket of value) {
                socket.emit('offline', username);
              }
            }
          }
        }
        this.onlineUsers.delete(username);
      }
    } catch (error) {
      this.logger.debug(error);
      client.disconnect();
    }
  }

  async emitInGameStatus(players: Player[]) {
    const playerOneFriends = await this.socialService.getUserFriends(
      players[0].username,
    );
    const playerTwoFriends = await this.socialService.getUserFriends(
      players[1].username,
    );
    for (const [key, value] of this.onlineUsers) {
      for (
        let i = 0;
        i < playerOneFriends.length && i < playerTwoFriends.length;
        i++
      ) {
        if (playerOneFriends[i].targetName === key) {
          for (const socket of value) {
            socket.emit('inGame', players[0].username);
          }
        }
        if (playerTwoFriends[i].targetName === key) {
          for (const socket of value) {
            socket.emit('inGame', players[1].username);
          }
        }
      }
    }
  }
}
