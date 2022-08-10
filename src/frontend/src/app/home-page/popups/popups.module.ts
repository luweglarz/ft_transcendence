import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from '../../avatar';
import { ProfilComponent } from './profil/profil.component';
import { LadderComponent } from './ladder/ladder.component';
import { SocialComponent } from './social/social.component';
import { CollapseService } from '../collapse.service';
import { NotificationService } from '../notification.service';
import { PopupsService } from './popups.service';
import { PopupsComponent } from './popups.component';
import { MatchHistoryComponent } from './profil/match-history/match-history.component';
import { ProfilInfoService } from './profil/profil-info.service';
import { JwtService } from '../../auth/jwt';


@NgModule({
  declarations: [
    ProfilComponent,
    LadderComponent,
    SocialComponent,
    MatchHistoryComponent,
    PopupsComponent
  ],
  providers: [
    CollapseService,
    PopupsService,
    NotificationService,
    ProfilInfoService,
    JwtService,
  ],
  imports: [
    CommonModule,
    AvatarModule,
  ]
})
export class PopupsModule {
  //
}
