'use client'
import { useAuthStore } from "@/store/auth.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const { setAuthState } = useAuthStore();

  useEffect(() => {
    
    if (status === "loading") {
      setAuthState("loading", null);
    } else if (status === "authenticated" && session) {
      setAuthState("authenticated", session);
    } else {
      setAuthState("unauthenticated", null);
    }
  }, [status, session, setAuthState]);

  return <>{children}</>;
};

export default AppLoader;