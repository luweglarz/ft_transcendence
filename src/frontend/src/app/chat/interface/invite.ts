export interface Invite {
    id?:            number,
    userId?:        number,
    username?:      string,
    targetUserId?:  number,
    roomId?:        number,
    challenge?:     boolean,
}

/*
model Invite {
  id            Int     @id @default(autoincrement())
  userId        Int
  username      String
  targetuserId  Int
  roomId        Int?
  challenge     Boolean
}
*/