"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signInSchema, SignInValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";

import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: SignInValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = signInSchema.parse(credentials);

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return { error: "user does not exist pls sign up" };
    }

    const validPassword = await verify(user.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return { error: "username or password is incorrect" };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    console.log(error);

    if (isRedirectError(error)) {
      throw error;
    }
    return {
      error: "Something went wrong",
    };
  }
}
