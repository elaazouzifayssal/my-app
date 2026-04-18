import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const title = body.title?.trim();

  if (!title) {
    return new Response("Title is required", { status: 400 });
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    const clerkUser = await currentUser();

    dbUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress,
        name:
          [clerkUser?.firstName, clerkUser?.lastName]
            .filter(Boolean)
            .join(" ") || null,
      },
    });
  }

  const habit = await prisma.habit.create({
    data: {
      title,
      clerkUserId: userId,
    },
  });

  return Response.json(habit, { status: 201 });
}
