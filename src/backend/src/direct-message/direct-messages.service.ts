import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class DirectMessagesService {
  constructor(private prisma: DbService, private http: HttpService) {
    //
  }

  getDms() {
    const allMessages = this.prisma.directMessage.findMany();
    return allMessages;
  }

  async getUserDms(username: string) {
    let allMessages = [];
    const sentMessages = await this.prisma.directMessage.findMany({
      where: {
        authorName: username,
      },
    });
    const receivedMessages = await this.prisma.directMessage.findMany({
      where: {
        targetName: username,
      },
    });
    allMessages = sentMessages.concat(receivedMessages);
    return allMessages;
  }

  async getUsersConversation(author: string, target: string) {
    let allMessages = [];
    const sentMessages = await this.prisma.directMessage.findMany({
      where: {
        authorName: author,
        targetName: target,
      },
    });
    const receivedMessages = await this.prisma.directMessage.findMany({
      where: {
        authorName: target,
        targetName: author,
      },
    });
    allMessages = sentMessages.concat(receivedMessages);
    allMessages.sort((n1, n2) => {
      if (n1.id > n2.id) {
        return 1;
      }
      if (n1.id < n2.id) {
        return -1;
      }
      return 0;
    });
    return allMessages;
  }

  async addUserDm(author: string, target: string, content: string) {
    const newMessage = await this.prisma.directMessage.create({
      data: {
        authorName: author,
        targetName: target,
        content: content,
      },
    });
    return newMessage;
  }

}
