import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatbarComponent } from './chatbar/chatbar.component';
import { HomeComponent } from './home/home.component';
import { PopupsComponent } from './popups/popups.component';
import { CollapseService } from './collapse.service';
import { NotificationService } from './notification.service';
import { PopupsService } from './popups/popups.service';
import { GameService } from '../pong/game/game.service';
import { PongModule } from '../pong/pong.module';
import { ProfilComponent } from './popups/profil/profil.component';
import { LadderComponent } from './popups/ladder/ladder.component';
import { SocialComponent } from './popups/social/social.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatModule } from '../chat/chat.module';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ChatbarComponent,
    PopupsComponent,
    ProfilComponent,
    LadderComponent,
    SocialComponent,
  ],
  providers: [CollapseService, PopupsService, NotificationService, GameService],
  imports: [
    CommonModule,
    PongModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ChatModule,
  ],
})
export class HomePageModule {}
