import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.todo.findMany();
  return Response.json(users);
}
