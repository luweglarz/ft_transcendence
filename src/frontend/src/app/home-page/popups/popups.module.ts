import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from '../../avatar';
import { ProfilComponent } from './profil/profil.component';
import { LadderComponent } from './ladder/ladder.component';
import { SocialComponent } from './social/social.component';
import { CollapseService } from '../services/collapse.service';
import { NotificationService } from '../services/notification.service';
import { PopupsService } from './popups.service';
import { PopupsComponent } from './popups.component';
import { MatchHistoryComponent } from './profil/match-history/match-history.component';
import { ProfilInfoService } from './profil/profil-info.service';
import { JwtService } from '../../auth/jwt';
import { LadderService } from './ladder/ladder.service';
import { SocialService } from './social/social.service';
import { DirectMessagesService } from './social/direct-messages.service';
import { SettingsComponent } from './settings/settings.component';
import { TwoFactorsModule } from 'src/app/auth/two-factors/two-factors.module';

@NgModule({
  declarations: [
    ProfilComponent,
    LadderComponent,
    SocialComponent,
    MatchHistoryComponent,
    PopupsComponent,
    SettingsComponent,
  ],
  providers: [
    CollapseService,
    PopupsService,
    NotificationService,
    ProfilInfoService,
    JwtService,
    LadderService,
    SocialService,
    DirectMessagesService,
  ],
  imports: [CommonModule, AvatarModule, TwoFactorsModule],
  exports: [PopupsComponent],
})
export class PopupsModule {
  //
}
