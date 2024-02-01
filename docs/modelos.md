# Event Block

```typescript
type EventBlock = {
  id: string;
  name: string;
  description: string;
  date: string; // ISO string
  initial_time: string; // ISO string
  final_time: string; // ISO string
  img: string; // URL
  events: {
    name: string;
    speaker: string;
    description: string;
    speakerImg: string; // URL
  }[];
  takenSeats: string[]; // Seat names (A1, K13...)
  takenSeatAssignments: {
    // STAFF ONLY: This information must ONLY be sent to STAFF users
    userId: string;
    name: string;
    seat: string; // Seat name (A1, K13...)
    attended: boolean;
  }[];
  waitlist: {
    // STAFF ONLY: This information must ONLY be sent to STAFF users
    userId: string;
    name: string;
    email: string; // BACKEND ONLY?
    date: string | number; // ISO string or Unix timestamp (seconds)
  }[];
};
```

# Normal User

```typescript
type User = {
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
```
