export {};

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
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
      };
    }
  }
}
