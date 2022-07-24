import { Room } from 'src/app/interface/room'

export interface Message {
    id?:        number;
    room?:      Room;
    //user?:    User;
    content?:   String;
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