/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useLayoutEffect } from "react";
import { createLocalStorageContext } from "./localStorage";

const { Provider: RawUserProvider, useContext: useUser } =
  createLocalStorageContext<{
    id: string;
    token: string;
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

function EffectsHandler({ children }: { children: React.ReactNode }) {
  const [user] = useUser();

  useLayoutEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["X-Access-Token"] = user.token;
    } else {
      delete axios.defaults.headers.common["X-Access-Token"];
    }
    return () => {
      delete axios.defaults.headers.common["X-Access-Token"];
    };
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
