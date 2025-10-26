// scripts/seed.mjs
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin account...");
  const hashed = await bcrypt.hash("Admin123@", 10);

  await prisma.account.upsert({
    where: { email: "secondlifeplastic@seli.id.vn" },
    update: { password: hashed },
    create: {
      email: "secondlifeplastic@seli.id.vn",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("Admin account created/updated!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});