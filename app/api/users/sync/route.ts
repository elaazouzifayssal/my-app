import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const clerkUser = await currentUser();

  await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? null,
      name:
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
        null,
    },
    create: {
      clerkUserId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? null,
      name:
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
        null,
    },
  });

  return Response.json({ ok: true });
}
