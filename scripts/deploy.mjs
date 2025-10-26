// scripts/deploy.mjs
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Running Prisma migrate deploy...");
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  console.log("Creating/updating admin account...");
  const hashed = await bcrypt.hash("Admin123@", 10);
  try {
    await prisma.account.upsert({
      where: { email: "secondlifeplastic@seli.id.vn" },
      update: { password: hashed },
      create: {
        email: "secondlifeplastic@seli.id.vn",
        password: hashed,
        role: "ADMIN",
      },
    });
    console.log("Admin account ready!");
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }

  await prisma.$disconnect();
  console.log("Deploy script completed!");
}

main().catch((e) => {
  console.error("Deploy script crashed:", e);
  process.exit(1);
});