// scripts/create-admin.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function createAdmin() {
  const email = "secondlifeplastic@seli.id.vn";
  const password = "Admin123@";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.account.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Admin created/updated:", admin.email);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();