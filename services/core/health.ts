import { prisma } from "@/lib/prisma";

export type HealthStatus = {
  ok: boolean;
  database: "up" | "down";
};

export async function healthCheck(): Promise<HealthStatus> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, database: "up" };
  } catch {
    return { ok: false, database: "down" };
  }
}
