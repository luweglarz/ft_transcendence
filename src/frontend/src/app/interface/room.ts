export interface Room {
    name:       string;
    password?:  string;
    roomType:   RoomType;
    //users:    RoomUser[];
    //messages  Message[];
}

export enum RoomType {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    PRIVATE = "PRIVATE"
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