import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatRoomCreateComponent } from './components/chat-room-create/chat-room-create.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatInviteComponent } from './components/chat-invite/chat-invite.component';
import { AvatarModule } from '../avatar';
import { PongModule } from '../pong/pong.module';

@NgModule({
  declarations: [
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
    ChatMainComponent,
    ChatInviteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSnackBarModule,
    AvatarModule,
    PongModule,
  ],
  exports: [
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
    ChatMainComponent,
    ChatInviteComponent,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
  ],
})
export class ChatModule {}
