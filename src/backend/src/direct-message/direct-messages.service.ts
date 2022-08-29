import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class DirectMessagesService {
  constructor(private prisma: DbService, private http: HttpService) {
    //
  }
}
