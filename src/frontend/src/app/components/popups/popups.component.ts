import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css']
})
export class PopupsComponent implements OnInit {

  @Input()
  navCollapsed = false;

  @Input()
  chatCollapsed = false;

  //Pop ups
  @Input()
  profilPopup = false;
  @Input()
  ladderPopup = false;
  @Input()
  socialPopup = false;

  @Output() profilEvent = new EventEmitter<boolean>();
  @Output() ladderEvent = new EventEmitter<boolean>();
  @Output() socialEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closePopup() {
    this.profilPopup = false;
    this.ladderPopup = false;
    this.socialPopup = false;
    this.profilEvent.emit(this.profilPopup);
    this.ladderEvent.emit(this.ladderPopup);
    this.socialEvent.emit(this.socialPopup);
  }

}
