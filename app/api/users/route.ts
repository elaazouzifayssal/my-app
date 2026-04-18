import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(todos, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clerkUserId = body.clerkUserId?.trim();
    const email = body.email?.trim();
    const name = body.name?.trim();

    if (!clerkUserId) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const todo = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        name,
      },
    });

    return Response.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, name, email } = body;

  const todo = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  return Response.json(todo, { status: 200 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  const todo = await prisma.habit.delete({
    where: { id },
  });

  return Response.json(todo, { status: 200 });
}
