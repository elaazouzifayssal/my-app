import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const habits = await prisma.habit.findMany({
    where: { clerkUserId: userId },
    include: {
      logs: {
        where: {
          date: { gte: startOfDay, lte: endOfDay },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = habits.map((habit) => ({
    id: habit.id,
    title: habit.title,
    description: habit.description,
    completedToday: habit.logs.length > 0 && habit.logs[0].completed,
  }));

  return Response.json(result, { status: 200 });
}
