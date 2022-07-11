export interface Room {
    id:         number
    createdAt:  Date;
    name:       string;
    password?:  string;
    roomType:   RoomType;
    //users:    RoomUser[];
    //messages  Message[];
}

export enum RoomType {
    PUBLIC,
    PROTECTED,
    PRIVATE
}

// prisma model
/*

enum  RoomType {
  PUBLIC
  PROTECTED
  PRIVATE
}

model Room {
  id          Int       @id @default(autoincrement())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  name        String    @unique
  password    String?
  roomType    RoomType
  users       RoomUser[]
  messages    Message[]
}
*/