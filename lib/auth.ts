// lib/auth.ts
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getAdminUser() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;

  return await prisma.account.findUnique({
    where: { id: parseInt(session) },
    select: { id: true, email: true },
  });
}