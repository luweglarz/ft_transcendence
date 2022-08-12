import { Injectable } from "@nestjs/common";
import { RoomUser, User } from "@prisma/client";
import { DbService } from "src/db/db.service";
import { RoomUserService } from "../room-user/room-user.service";


@Injectable()
export class CommandService {

    constructor(
        private roomUserService: RoomUserService,
        private prisma: DbService,
        ) {}

    async exec(command, user: User ) {
        let roomUser = await this.roomUserService.roomUsers({where: {roomId: command.id, AND: {userId: user.id}}});
        if (roomUser.length != 1)
            return ;
        console.log(roomUser);
        let splitCmd: string[] = command.command.split(/[ \t\n]+/);
        console.log(splitCmd);
        if (splitCmd.length < 2)
            return ;
        this.cmdSelector(splitCmd, command, roomUser[0]);
    }

    cmdSelector(splitCmd: string[], command, roomUser: RoomUser) {
        if (splitCmd[0] === '/admin') {
            this.admin(splitCmd, command, roomUser);
        } else if (splitCmd[0] === '/deadmin') {
            this.deadmin(splitCmd, command, roomUser);
        }
    }

    async admin(splitCmd: string[], command, roomUser: RoomUser) {
        if (roomUser.role === 'USER' || roomUser.role === 'ADMIN')
            return ;
        let targetUser = await this.prisma.user.findUnique({where: {username: splitCmd[1]}});
        console.log(targetUser);
        if (targetUser === null)
            return ;
        let targetRoomUser = await this.roomUserService.roomUsers({where: {roomId: command.id, AND: {userId: targetUser.id}}});
        console.log(targetRoomUser);
        if (targetRoomUser.length != 1)
            return ;
        console.log('just before the update');
        if (targetRoomUser[0].role === 'USER')
            await this.roomUserService.updateRole(targetRoomUser[0].roomUserId, 'ADMIN');
    }
    async deadmin(splitCmd: string[], command, roomUser: RoomUser) {
    if (roomUser.role === 'USER' || roomUser.role === 'ADMIN')
        return ;
    let targetUser = await this.prisma.user.findUnique({where: {username: splitCmd[1]}});
    console.log(targetUser);
    if (targetUser === null)
        return ;
    let targetRoomUser = await this.roomUserService.roomUsers({where: {roomId: command.id, AND: {userId: targetUser.id}}});
    console.log(targetRoomUser);
    if (targetRoomUser.length != 1)
        return ;
    console.log('just before the update');
    if (targetRoomUser[0].role === 'ADMIN')
        await this.roomUserService.updateRole(targetRoomUser[0].roomUserId, 'USER');
    }
}
/*
- ban 2
- mute 2
- password 0
- admin 0
- deadmin 1
- invite 3
- challenge 4
*/