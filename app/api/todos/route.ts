import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(todos, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return Response.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title?.trim();

    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
      },
    });

    return Response.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create todo:", error);
    return Response.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, completed } = body;

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  return Response.json(todo, { status: 200 });
}
