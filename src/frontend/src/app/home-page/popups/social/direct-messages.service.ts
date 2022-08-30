import { Injectable } from '@angular/core';

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

  loadedDmUsername: string = 'username';
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
  ];

  constructor() { }
}