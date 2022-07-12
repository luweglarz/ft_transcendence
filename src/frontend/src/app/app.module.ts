import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { PongModule } from './pages/pong/pong.module';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatchmakingComponent } from './components/matchmaking/matchmaking.component';
import { ProfilComponent } from './components/profil/profil.component';
import { LadderComponent } from './components/ladder/ladder.component';
import { SocialComponent } from './components/social/social.component';
import { ChatbarComponent } from './components/chatbar/chatbar.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list' 
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'
import { ChatRoomCreateComponent } from './components/chat-room-create/chat-room-create.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    MatchmakingComponent,
    ProfilComponent,
    LadderComponent,
    SocialComponent,
    ChatbarComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PongModule,
    HttpClientModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
