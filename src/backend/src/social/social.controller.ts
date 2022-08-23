import { Controller, Get, Post, Query } from '@nestjs/common';
import { Relation } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private prismaClient: DbService, public socialService: SocialService) {
        //
    }

    @Get('')
    async getSocialList() {
        return (this.socialService.getSocial());
    }

    @Get('friends')
    async getUserFriends(@Query('username') username: string) {
        return (this.socialService.getUserFriends(username));
    }

    @Get('blocked')
    async getUserBlocked(@Query('username') username: string) {
        return (this.socialService.getUserBlocked(username));
    }

    @Post('add')
    async addUserRelation(@Query('author') authorName: string, @Query('target') targetName: string, @Query('relation') relation: Relation) {
        return (this.socialService.addUserRelation(authorName, targetName, relation));
    }

    @Post('update')
    async updateUserRelation(@Query('author') authorName: string, @Query('target') targetName: string, @Query('relation') relation: Relation) {
        return (this.socialService.updateUserRelation(authorName, targetName, relation));
    }
}
