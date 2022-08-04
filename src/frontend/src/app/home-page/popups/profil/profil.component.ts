import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/auth/jwt';
import { ProfilInfoService } from './profil-info.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {

  constructor(public jwtService: JwtService, public profilInfoService: ProfilInfoService) {
    //
  }

  ngOnInit(): void {
    //
  }
}
