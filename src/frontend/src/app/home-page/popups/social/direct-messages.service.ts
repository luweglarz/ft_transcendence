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
  providedIn: 'root'
})
export class DirectMessagesService {

  loadedDmUsername: string = 'usertest';
  loadedDms: Message[] = [
    {
      id: 1,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'Salut ca va ?',
    },{
      id: 2,
      authorName: 'usertest',
      targetName: 'ugtheven',
      content: 'Ca va et toi ?',
    },{
      id: 3,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'Ca va, ca va tranquillou',
    },{
      id: 4,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'Tu veux jouer ?',
    },{
      id: 5,
      authorName: 'usertest',
      targetName: 'ugtheven',
      content: 'En custom ?',
    },{
      id: 6,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'Ca marche je t invite',
    },{
      id: 7,
      authorName: 'usertest',
      targetName: 'ugtheven',
      content: 'Dacc mais je joue pas longtemps',
    },
    {
      id: 8,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur imperdiet justo non suscipit lobortis. Aliquam sodales bibendum odio at pellentesque. Duis ac mollis ante. Aliquam quis lacus purus.',
    },{
      id: 9,
      authorName: 'usertest',
      targetName: 'ugtheven',
      content: 'Curabitur at porta diam. Donec at dapibus elit. Integer lobortis orci in tellus viverra tempor. Sed quis massa sed turpis venenatis lobortis et eget tortor. Nunc accumsan aliquet mattis. Sed non est dictum metus viverra tempus. Sed mattis massa eu consequat finibus. ',
    },{
      id: 10,
      authorName: 'ugtheven',
      targetName: 'usertest',
      content: 'In rhoncus dictum est vitae dictum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    },
  ];
  isLoaded: boolean = false;

  constructor(private http: HttpClient) {
    //
  }

  async getUsersConversation(author: string, target: string) {
    this.http
      .get<Message[]>(
        `${environment.backend}/direct-messages/conversation?author=` + author + '&target=' + target,
      )
      .subscribe((val) => {
        val.forEach((data) => {
          this.loadedDms.push(Object.assign({}, data));
        });
      });
  }

  async loadUserSocial(author: string, target: string) {
    this.loadedDms.splice(0, this.loadedDms.length);
    await this.getUsersConversation(author, target);
    this.isLoaded = true;
  }
}
