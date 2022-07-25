import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CollapseService } from 'src/app/home-page/collapse.service';
import { PopupsService } from 'src/app/home-page/popups.service';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css']
})
export class PopupsComponent implements OnInit {

  constructor(public collapseService: CollapseService, public popupsService: PopupsService) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.popupsService.closePopup();
    console.log(this.popupsService.profilPopup, this.popupsService.ladderPopup, this.popupsService.socialPopup);
  }

}
