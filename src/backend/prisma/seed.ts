// We might want to seed our databse in the future

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const users = [
    {
        username: 'lucas',
        email: 'lucas@mail.com',
        password: 'lucas',
    },
    {
        username: 'ugo',
        email: 'ugo@mail.com',
        password: 'ugo',
    },
    {
        username: 'jeremy',
        email: 'jeremy@mail.com',
        password: 'jeremy',
    },
    {
        username: 'matthieu',
        email: 'matthieu@mail.com',
        password: 'matthieu',
    },
  ];

  async function createGames(){
    let winner;
    let loser;

    for ( let i = 0; i < 10; i++){
        winner = await  prisma.user.findUnique({
            where: { username: users[Math.floor(Math.random() * 4)].username },
        });
        loser = winner;
        while (loser.id === winner.id){
          loser = await  prisma.user.findUnique({
              where: { username: users[Math.floor(Math.random() * 4)].username },
          });
        }
        await prisma.game.create({
            data: {
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
  }

  
async function main(){
  await prisma.user.createMany({
    data: users,
  });
  await createGames();
}

main();