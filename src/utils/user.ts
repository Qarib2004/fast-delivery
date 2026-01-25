import { User } from "@/types/form-data";
import prisma from "./prisma";

export async function getUserFromDb(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt:true,
        updatedAt:true
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}