import { Component } from '@angular/core';
import { StatusSocket } from './home-page/popups/social/class/status-socket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private statusSocket: StatusSocket) {}
  title = 'frontend';
}
