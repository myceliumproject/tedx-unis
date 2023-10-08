import { createLocalStorageContext } from "./localStorage";

export const { Provider: UserProvider, useContext: useUser } =
  createLocalStorageContext<{
    id: string;
    name: string;
    tickets: {
      blockId: string;
      seat: string;
      token: string;
    }[];
  } | null>("user", (user) => user);
