import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css']
})
export class PopupsComponent implements OnInit {

  @Input()
  navCollapsed = false;

  //Pop ups
  @Input()
  profilPopup = false;
  @Input()
  ladderPopup = false;
  @Input()
  socialPopup = false;

  constructor() { }

  ngOnInit(): void {
  }

  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
  }

}
