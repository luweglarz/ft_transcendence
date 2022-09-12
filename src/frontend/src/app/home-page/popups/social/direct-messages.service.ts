import { HttpClient } from '@angular/common/http';
import { forwardRef, Inject, Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';
import { SocialService } from './social.service';

interface Message {
  createdAt: string;
  id: number;
  authorName: string;
  targetName: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class DirectMessagesService {
  username = '';
  loadedDmUsername = '';
  loadedDms: Message[] = [];
  isLoaded = false;

  constructor(private jwtService: JwtService, private http: HttpClient, private socialService: SocialService) {
    const tmp = this.jwtService.username;
    if (tmp != undefined) this.username = tmp;
  }

  //Retrieve DMs between 2 users
  async getUsersConversation(author: string, target: string) {
    this.http
      .get<Message[]>(
        `${environment.backend}/direct-messages/conversation?author=` +
          author +
          '&target=' +
          target,
      )
      .subscribe((val) => {
        val.forEach((data) => {
          this.loadedDms.push(Object.assign({}, data));
        });
      });
  }

  //Load DMs between 2 users
  async loadUserDms(author: string, target: string) {
    if (this.socialService.blocked.findIndex((blocked) => blocked.authorName === author && blocked.targetName === target) == -1){
      this.loadedDms.splice(0, this.loadedDms.length);
      this.loadedDmUsername = target;
      await this.getUsersConversation(author, target);
    }
    this.isLoaded = true;
  }

  //Add the message in the backend
  sendMessage(target: string, content: string) {
    if (content.length > 0) {
      this.http
        .post(`${environment.backend}/direct-messages/add?target=` + target, {
          content: content,
        })
        .subscribe();
      const dateNow = new Date();
      this.loadedDms.push({
        id: 1,
        createdAt: dateNow.toISOString(),
        authorName: this.username,
        targetName: target,
        content: content,
      });
    }
  }
}
