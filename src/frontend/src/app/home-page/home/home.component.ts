import { Component, OnInit } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups/popups.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    public collapseService: CollapseService,
    public popupsService: PopupsService,
  ) {
    //
  }

  ngOnInit(): void {
    //
  }

  // PROFIL POP UP
  closePopup() {
    this.popupsService.closePopup();
  }
}
