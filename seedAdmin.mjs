import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {
      passwordHash,
      role: 'ADMIN',
      name: 'Admin'
    },
    create: {
      email: 'admin',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Admin user seeded:', admin.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
