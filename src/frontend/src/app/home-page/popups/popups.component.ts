import { Component, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css'],
})
export class PopupsComponent implements OnInit {
  constructor(
    public collapseService: CollapseService,
    public popupsService: PopupsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if ('popup' in params) {
        const component = params['popup'];
        switch (component) {
          case 'profile':
            this.popupsService.openProfil(params['username']);
            break;
          case 'ladder':
            this.popupsService.openLadder();
            break;
          case 'social':
            this.popupsService.openSocial(params['username']);
            break;
          case 'settings':
            this.popupsService.openSettings();
            break;
          default:
            this.popupsService.closePopup();
            break;
        }
      } else this.popupsService.closePopup();
    });
  }

  closePopup() {
    this.popupsService.closePopup();
  }

  manageClassCollapse(): string {
    if (
      this.collapseService.navCollapsed == true &&
      this.collapseService.chatCollapsed == true
    ) {
      return 'popup-full-collapsed';
    } else if (
      this.collapseService.navCollapsed == false &&
      this.collapseService.chatCollapsed == false
    ) {
      return 'popup-full-uncollapsed';
    } else if (
      this.collapseService.navCollapsed == true &&
      this.collapseService.chatCollapsed == false
    ) {
      return 'popup-nav-collapsed';
    } else if (
      this.collapseService.navCollapsed == false &&
      this.collapseService.chatCollapsed == true
    ) {
      return 'popup-chat-collapsed';
    }
    return '';
  }
}
