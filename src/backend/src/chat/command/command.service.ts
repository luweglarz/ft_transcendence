import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { RoomUserService } from "../room-user/room-user.service";


@Injectable()
export class CommandService {

    constructor(private roomUserService: RoomUserService) {}

    async exec(command, user: User ) {
        let roomUser = await this.roomUserService.roomUsers({where: {roomId: command.id, AND: {userId: user.id}}});
        console.log(roomUser);
    }
}