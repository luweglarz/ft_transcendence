import { Component, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css'],
})
export class PopupsComponent implements OnInit {
  constructor(
    public collapseService: CollapseService,
    public popupsService: PopupsService,
  ) {}

  ngOnInit(): void {
    //
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
