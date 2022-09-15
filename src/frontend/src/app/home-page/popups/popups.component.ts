import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/services/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css'],
})
export class PopupsComponent implements OnInit, OnDestroy {
  private _queryParamsSubscription?: Subscription;

  constructor(
    public collapseService: CollapseService,
    public popupsService: PopupsService,
    private route: ActivatedRoute,
  ) {}

  get popup() {
    return this.popupsService.popup;
  }

  ngOnInit(): void {
    this._queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        // console.debug(`POPUP query params: ${JSON.stringify(params)}`);
        if ('popup' in params) {
          const popupName = params['popup'];
          const username = params['username'];
          this.popupsService.openPopup(popupName, username);
        } else this.popupsService.closePopup();
      },
    );
  }

  ngOnDestroy(): void {
    this._queryParamsSubscription?.unsubscribe();
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
