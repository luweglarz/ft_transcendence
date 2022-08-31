import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { environment } from 'src/environments/environment';
import { SocialService } from './social.service';

interface Message {
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

  constructor(private jwtService: JwtService, private http: HttpClient) {
    const tmp = this.jwtService.getPayload()?.username;
    if (tmp != undefined)
      this.username = tmp;
  }

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

  async loadUserDms(author: string, target: string) {
    this.loadedDms.splice(0, this.loadedDms.length);
    this.loadedDmUsername = target;
    await this.getUsersConversation(author, target);
    this.isLoaded = true;
  }

  sendMessage(author: string, target: string, content: string){
    console.log('Je suis : ', author);
    console.log('Jenvoie : ', content);
    console.log('A : ', target);
    this.http.post<{content: string}>(`${environment.backend}/direct-messages/conversation?author=` + author + '&target=' + target, content);
  }
}
