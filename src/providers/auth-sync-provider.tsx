"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAuthStore } from "@/store/auth.store"
import type { Session } from "next-auth"

type AuthStatus = "authenticated" | "loading" | "unauthenticated"

export default function AuthSyncProvider() {
  const { data: session, status } = useSession()
  const setAuthState = useAuthStore((s) => s.setAuthState)

  useEffect(() => {
    setAuthState(status as AuthStatus, session as Session | null)
  }, [status, session, setAuthState])

  return null
}

// "use client"

// import { useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { useAuthStore } from "@/store/auth.store"

// export default function AuthSyncProvider() {
//   const { data: session, status } = useSession()
//   const setAuthState = useAuthStore((s) => s.setAuthState)

//   useEffect(() => {
//     setAuthState(status as any, session ?? null)
//   }, [status, session, setAuthState])

//   return null
// }
