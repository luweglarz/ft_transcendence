import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  loadedDmUsername = '';
  loadedDms: Message[] = [];
  isLoaded = false;

  constructor(private http: HttpClient) {
    //
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
}
