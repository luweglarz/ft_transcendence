import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtUser } from 'src/auth/modules/jwt/dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AvatarService {
  constructor(private db: DbService) {}

  async uploadAvatar(user: JwtUser, image: Buffer) {
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

  async getResponse(username: string, res: Response) {
    const avatar = await this.findAvatar(username);
    if (avatar) return this.fileResponse(avatar.image, avatar.mimeType, res);
    else return '';
  }

  async hasAvatar(username: string) {
    return await this.db.avatar.count({
      where: { user: { username: username } },
    });
  }

  async findAvatar(username: string) {
    const avatar = await this.db.avatar.findFirst({
      where: { user: { username: username } },
    });
    return avatar;
  }

  fileResponse(file: Buffer, contentType: string, res: Response) {
    res.type(contentType);
    return new StreamableFile(file);
  }
}
