import { Session } from "next-auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionStatus = "authenticated" | "unauthenticated" | "loading";

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      status: "loading",
      session: null,
      setAuthState: (status: SessionStatus, session: Session | null) => {
        console.log("🔄 Updating auth state:", { status, session });
        set({
          isAuth: status === "authenticated",
          status,
          session,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);