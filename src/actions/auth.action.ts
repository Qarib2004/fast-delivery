"use server";
import { signIn, signOut } from "@/auth/auth";
import { auth } from "@/auth/auth"; 
import { IFormData } from "@/types/form-data";
import { saltAndHashPassword } from "@/utils/password";
import prisma from "@/utils/prisma";

export async function registerUser(params: IFormData) {
  const { name, email, password, confirmPassword } = params;
  try {
    const hashedPassword = await saltAndHashPassword(password);

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

    if (result?.error) {
      return { error: result.error };
    }

    await new Promise(resolve => setTimeout(resolve, 100));


    const session = await auth();

    console.log("Session after login:", session);
    
    if (!session) {
      return { error: "Failed to create session" };
    }

    return { 
      success: true, 
      session: session || null 
    };
  } catch (error) {
    console.error("Error authorization", error);
    return { error: "Authentication failed" };
  }
}


export async function signOutFunc() {
  try {
    const result = await signOut({ redirect: false });
    console.log("result " + result);
    return result;
  } catch (error) {
    console.error("Error for authorization " + error);
    throw error;
  }
}


export async function getSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}