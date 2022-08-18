// We might want to seed our databse in the future
import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface User {
  username: string;
  email: string;
  password: string;
}

async function createUser(user: User) {
  const hashedPassword = await argon.hash(user.password);
  await prisma.user.create({
    data: {
      username: user.username,
      auth: { create: { email: user.email, password: hashedPassword } },
    },
  });
}

async function createGame(users: User[]) {
  const winner = await prisma.user.findUnique({
    where: { username: users[Math.floor(Math.random() * 4)].username },
  });
  let loser = winner;
  while (loser.id === winner.id) {
    loser = await prisma.user.findUnique({
      where: { username: users[Math.floor(Math.random() * 4)].username },
    });
  }
  const type = Math.floor(Math.random() * 3);
  const modes = new Array<string>('normal', 'ranked', 'custom');
  await prisma.game.create({
    data: {
      type: modes[type],
      winner: {
        connect: { id: winner.id },
      },
      winnerGoals: 11,
      loser: {
        connect: { id: loser.id },
      },
      loserGoals: Math.floor(Math.random() * 11),
    },
  });
}

async function main() {
  const users: User[] = [
    { username: 'lucas', email: 'lucas@mail.com', password: 'lucas' },
    { username: 'ugo', email: 'ugo@mail.com', password: 'ugo' },
    { username: 'matthieu', email: 'matthieu@mail.com', password: 'matthieu' },
    { username: 'jeremy', email: 'jeremy@mail.com', password: 'jeremy' },
  ];
  for (let i = 0; i < users.length; i++) {
    await createUser(users[i]);
  }
  for (let i = 0; i < 10; i++) {
    await createGame(users);
  }
}

main();
