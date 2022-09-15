import { Component } from '@angular/core';
import { CollapseService } from '../../../home-page/services/collapse.service';
import { WaitService } from './wait.service';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css'],
})
export class WaitComponent {
  constructor(
    public waitService: WaitService,
    public collapseService: CollapseService,
  ) {
    //
  }
}
