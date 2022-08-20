import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private prismaClient: DbService, public socialService: SocialService) {
        //
    }

    @Get('mySocial')
    async getMySocialList(@Query('username') username: string) {
        return { relations: this.socialService.getMySocial(username) };
    }

    @Get('theirSocial')
    async getTheirSocialList(@Query('username') username: string) {
        return { relations: this.socialService.getTheirSocial(username) };
    }

    @Get('create')
    async createRelation(@Query('author') author: string, @Query('target') target: string) {
        this.socialService.createRelation(author, target);
    }
}
