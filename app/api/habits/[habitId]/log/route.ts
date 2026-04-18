import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ habitId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { habitId: habitIdParam } = await params;
    const habitId = Number(habitIdParam);

    if (Number.isNaN(habitId)) {
      return Response.json({ error: "Invalid habitId" }, { status: 400 });
    }

    const logs = await prisma.habitLog.findMany({
      where: {
        habitId,
        habit: {
          clerkUserId: userId,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json(logs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch habit logs:", error);
    return Response.json(
      { error: "Failed to fetch habit logs" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ habitId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { habitId: habitIdParam } = await params;
    const habitId = Number(habitIdParam);

    if (Number.isNaN(habitId)) {
      return Response.json({ error: "Invalid habitId" }, { status: 400 });
    }

    const body = await request.json();
    const completed = body.completed;
    const date = body.date;

    if (typeof completed !== "boolean") {
      return Response.json(
        { error: "completed must be true or false" },
        { status: 400 },
      );
    }

    if (!date) {
      return Response.json({ error: "date is required" }, { status: 400 });
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.clerkUserId !== userId) {
      return new Response("Not found", { status: 404 });
    }

    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: new Date(date),
        },
      },
      update: {
        completed,
      },
      create: {
        habitId,
        date: new Date(date),
        completed,
      },
    });

    return Response.json(log, { status: 201 });
  } catch (error) {
    console.error("Failed to create habit log : ", error);
    return Response.json(
      { error: "Failed to create habit log" },
      { status: 500 },
    );
  }
}
