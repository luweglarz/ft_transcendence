import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}

  async listUsers() {
    const users = await this.db.user.findMany();
    return users.map((user) => user.username);
  }
}
