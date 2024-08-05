import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataIncludes } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: postDataIncludes,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
