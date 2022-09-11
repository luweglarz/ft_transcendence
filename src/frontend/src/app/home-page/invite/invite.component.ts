import { Component, OnInit } from '@angular/core';
import { CollapseService } from '../services/collapse.service';
import { InviteService } from '../services/invite.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements OnInit {
  constructor(
    public collapseService: CollapseService,
    public inviteService: InviteService,
  ) {}

  ngOnInit(): void
//}
}
