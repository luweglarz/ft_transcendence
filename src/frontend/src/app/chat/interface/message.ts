import { Room } from 'src/app/chat/interface/room';

export interface Message {
  id?: number;
  room?: Room;
  roomId?: number;
  username?: string;
  userId?: number;
  content?: string;
  dm?: boolean;
}

/*
model Message {
  id          Int       @id @default(autoincrement())
  room        Room      @relation(fields: [roomId], references: [id])
  roomId      Int
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
  content     String
}
*/
