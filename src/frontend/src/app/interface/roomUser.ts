
export interface RoomUser {
    roomUserId?:    number;
    userId?:        number;
    roomId?:        number;
    username?:      string;
    role?:          Role;
    isBanned?:      Boolean;
    isMuted?:       Boolean;
    timeOut?:       Date;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
  }

/*
model RoomUser {
  roomUserId Int         @id @default(autoincrement())
  user     User      @relation(fields: [userId], references: [id])
  userId   Int
  room     Room      @relation(fields: [roomId], references: [id])
  roomId   Int
  role     Role
  isBanned Boolean   @default(false)
  isMuted  Boolean   @default(false)
  timeOut  DateTime?

}

enum Role {
  USER
  ADMIN
  OWNER
}
*/