"use server";
import { signIn } from "@/auth/auth";
import { IRegisterUserParams } from "@/types/form-data";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(params: IRegisterUserParams) {
  try {
    const hashedPassword = await bcrypt.hash(params.password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: params.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const user = await prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        password: hashedPassword,
      },
    });

    console.log("user: " + user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user" };
  }
}

export async function signInWithCredentials(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return result;
  } catch (error) {
    console.error("Error authorization", error);
    throw error;
  }
}




