import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3]?.trim();

if (!email || !password || password.length < 6) {
  console.error(
    "Uso: node scripts/reset-user-password.mjs correo@ejemplo.com nuevaClave123",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No hay usuario con correo: ${email}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log(`Contraseña actualizada para ${email}`);
} finally {
  await prisma.$disconnect();
}
