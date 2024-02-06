/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useEffect } from "react";
import { createLocalStorageContext } from "./localStorage";

const { Provider: RawUserProvider, useContext: useUser } =
  createLocalStorageContext<{
    id: string;
    token: string;
    tokenExp: number;
    email: string;
    name: string;
    tickets: {
      blockId: string;
      seat: string;
      token: string;
    }[];
    waitlist: {
      blockId: string;
      date: string | number; // ISO string or Unix timestamp (seconds)
    }[];
  } | null>("user", (user) => user);

try {
  axios.defaults.headers.common["X-Access-Token"] = JSON.parse(
    localStorage.getItem("user")
  )?.token;
} catch {
  // ignore
}

function EffectsHandler({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useUser();

  useEffect(() => {
    if (
      (user?.tokenExp ?? null) !== null &&
      Date.now() / 1000 > user.tokenExp
    ) {
      setUser(null);
    }
  }, [setUser, user?.tokenExp]);

  useEffect(() => {
    axios.defaults.headers.common["X-Access-Token"] = user?.token;
  }, [user?.token]);

  return children;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <RawUserProvider>
      <EffectsHandler>{children}</EffectsHandler>
    </RawUserProvider>
  );
}

export { useUser };
