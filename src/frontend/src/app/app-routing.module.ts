import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PongComponent } from './pong/pong.component';

const routes: Routes = [
  { path: "game", component: PongComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
