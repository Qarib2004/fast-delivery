import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "@/utils/user"
import { signInSchema } from "@/schema/zod"
import {PrismaAdapter} from "@auth/prisma-adapter"
import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs"
  
export const { handlers,signIn,signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({

      credentials: {
        email: {label:"Email",type:"email"},
        password: {label:"Password",type:"password"},
      },
      authorize: async (credentials) => {
        try {

          if(!credentials.email || !credentials.password){
            throw new Error("Email and password required")
          }
 
          const { email, password } = await signInSchema.parseAsync(credentials)
 
 
          const user = await getUserFromDb(email)
 
          if (!user) {
            throw new Error("Invalid credentials.")
          }

          const isPasswordValid = await bcrypt.compare(password,user.password)
 
          
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.")
          }

          return {id:user.id,email:user.email,name:user.name}
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }else{
            return null
          }
        }
      },
    }),
  ],
  session:{
    strategy:'jwt',
    maxAge:3600,
  },
  secret:process.env.NEXTAUTH_SECRET,
  callbacks:{
    async jwt({token,user}){
      if(user){
        token.id=user.id
      }
   return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})