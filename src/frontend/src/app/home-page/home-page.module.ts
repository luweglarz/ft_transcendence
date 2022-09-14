import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatbarComponent } from './chatbar/chatbar.component';
import { HomeComponent } from './home.component';
import { CollapseService } from './services/collapse.service';
import { NotificationService } from './services/notification.service';
import { PopupsService } from './popups/popups.service';
import { GameService } from '../pong/game/game.service';
import { PongModule } from '../pong/pong.module';
import { RouterModule } from '@angular/router';
import { ChatModule } from '../chat/chat.module';
import { AvatarModule } from '../avatar';
import { ProfilInfoService } from './popups/profil/profil-info.service';
import { PopupsModule } from './popups/popups.module';
import { InviteComponent } from './invite/invite.component';
import { WaitComponent } from './wait/wait.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ChatbarComponent,
    InviteComponent,
    WaitComponent,
  ],
  providers: [
    CollapseService,
    PopupsService,
    NotificationService,
    GameService,
    ProfilInfoService,
  ],
  imports: [
    CommonModule,
    PongModule,
    RouterModule,
    ChatModule,
    AvatarModule,
    PopupsModule,
  ],
})
export class HomePageModule {
  //
}
