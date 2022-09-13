import { Component, OnInit } from '@angular/core';
import { CollapseService } from '../services/collapse.service';
import { WaitService } from '../services/wait.service';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})
export class WaitComponent {

  constructor(public waitService: WaitService, public collapseService: CollapseService) {
    //
  }

}
