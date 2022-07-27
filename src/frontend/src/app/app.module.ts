import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PongModule } from './pong/pong.module';
import { AuthModule, JwtInterceptor } from './auth';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './home-page/home/home.component';
import { NavbarComponent } from './home-page/navbar/navbar.component';
import { ProfilComponent } from './home-page/popups/profil/profil.component';
import { LadderComponent } from './home-page/popups/ladder/ladder.component';
import { SocialComponent } from './home-page/popups/social/social.component';
import { ChatbarComponent } from './home-page/chatbar/chatbar.component';
import { SocketIoModule } from 'ngx-socket-io';
import { PopupsComponent } from './home-page/popups/popups.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    NavbarComponent,
    ProfilComponent,
    LadderComponent,
    SocialComponent,
    ChatbarComponent,
    PopupsComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PongModule,
    HttpClientModule,
    AuthModule,
    SocketIoModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
