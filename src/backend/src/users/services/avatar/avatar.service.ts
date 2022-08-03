import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AvatarService {
  constructor(private db: DbService) {}

  async uploadAvatar(user: JwtPayload, image: Buffer) {
    try {
      await this.db.avatar.upsert({
        where: { userId: user.sub },
        create: { userId: user.sub, image: image, mimeType: 'image/jpg' },
        update: { image: image, mimeType: 'image/jpg' },
      });
    } catch (err) {
      console.log(`Error: ${this.uploadAvatar.name} failed.`);
      throw new InternalServerErrorException('Could not upload the avatar');
    }
  }

  async getAvatar(username: string) {
    try {
      const avatar = await this.db.avatar.findFirst({
        where: { user: { username: username } },
      });
      return avatar;
    } catch (err) {
      console.log(`Error: ${this.uploadAvatar.name} failed.`);
      throw new InternalServerErrorException('Could not download the avatar');
    }
  }
}
