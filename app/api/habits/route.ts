import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const todos = await prisma.habit.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(todos, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch habits:", error);
    return Response.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title?.trim();
    const description = body.description?.trim();
    const { userId } = await auth();

    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const todo = await prisma.habit.create({
      data: {
        title: title,
        description: description || null,
        clerkUserId: userId,
      },
    });

    return Response.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create habit:", error);
    return Response.json({ error: "Failed to create habit" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, title } = body;

  const todo = await prisma.habit.update({
    where: { id },
    data: { title },
  });

  return Response.json(todo, { status: 200 });
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      return new Response("Not found", { status: 404 });
    }

    if (habit.clerkUserId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    const deleted = await prisma.habit.delete({
      where: { id },
    });

    return Response.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Error", { status: 500 });
  }
}
