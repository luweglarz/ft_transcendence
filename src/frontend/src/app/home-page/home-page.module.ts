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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { ChatMessageComponent } from '../components/chat-message/chat-message.component';
import { ChatRoomCreateComponent } from '../components/chat-room-create/chat-room-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ChatbarComponent,
    PopupsComponent,
    ProfilComponent,
    LadderComponent,
    SocialComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
  ],
  providers: [CollapseService, PopupsService, NotificationService, GameService],
  imports: [
    CommonModule,
    PongModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class HomePageModule {}
