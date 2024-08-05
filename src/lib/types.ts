import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  avatarUrl: true,
  displayName: true,
} satisfies Prisma.UserSelect;

export const postDataIncludes = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataIncludes;
}>;
