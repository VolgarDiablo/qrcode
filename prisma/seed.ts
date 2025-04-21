import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const addNewuser = await prisma.user.upsert({
    where: { email: 'example@gmail.com' },
    update: {},
    create: {
      name: 'Anton',
      email: 'example@gmail.com',
      emailVerified: false,
      phone: 380,
      password: 'example_password',
      metaData: {
        browser: 'Chrome',
        ip: '127.0.0.1',
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
