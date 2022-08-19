import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private prismaClient: DbService, public socialService: SocialService) {
        //
    }

    @Get('relations')
    async getRelationsList(@Query('username') username: string) {
        return { relations: this.socialService.getRelations() };
    }

    @Get('create')
    async createRelation() {
        this.socialService.createRelation();
    }
}
