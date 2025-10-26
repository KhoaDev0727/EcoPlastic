// scripts/deploy.ts
import { execSync } from "child_process";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("Running Prisma migrate deploy...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  console.log("Creating/updating admin account...");
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

  console.log("Deploy script completed!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Deploy script failed:", e);
  process.exit(1);
});