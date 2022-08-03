import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatRoomCreateComponent } from './chat-room-create/chat-room-create.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
    ChatMainComponent,
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
  ],
  exports: [
    ChatRoomComponent,
    ChatMessageComponent,
    ChatRoomCreateComponent,
    ChatMainComponent,
  ],
})
export class ChatModule {}
