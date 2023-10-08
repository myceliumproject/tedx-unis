import "dotenv/config";

import cors from "cors";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { db } from "./db.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/hello", (req, res) => {
  res.json("hello!");
});

/** TEST API **/
app.get("/test", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('test').add(data);

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Test Error' });
  }
})

/** EMPTY EVENT BLOCKS **/
app.post('/eventblock', async (req, res) => {
  try {
    const eventBlock = {
      datetime: '', 
      img: '', // URL
      events: [
        {
          name: '',
          speaker: '',
          description: '',
          speakerImg: '', // URL
        },
        {
          name: '',
          speaker: '',
          description: '',
          speakerImg: '', // URL
        },
        {
          name: '',
          speaker: '',
          description: '',
          speakerImg: '', // URL
        },
      ],
      takenSeats: [],
      takenSeatAssignments: [],
      waitlist: [],
    };

    const docRef = await db.collection('event_blocks').add(eventBlock);

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error 500' });
  }
})

/** GET ALL EVENT BLOCKS **/
app.get('/eventblock/list', async (req, res) => {
  try {
    const eventBlocksSnapshot = await db.collection('event_blocks').get();
    const eventBlocks = [];

    eventBlocksSnapshot.forEach((doc) => {
      const eventBlockData = doc.data();
      eventBlocks.push({ id: doc.id, ...eventBlockData });
    });

    res.status(200).json({code: 0, data: eventBlocks});
  } catch (error) {
    res.status(500).json({ error: 'Error 500' });
  }
});

/** SPECIFIC EVENT BLOCK **/
app.get('/eventblock/get/:eventBlockId', async (req, res) => {
  try {
    const { eventBlockId } = req.params;

    const eventBlockRef = db.collection('event_blocks').doc(eventBlockId);
    const eventBlockSnapshot = await eventBlockRef.get();
    const eventBlockData = eventBlockSnapshot.data();

    res.status(200).json({code: 0, data: eventBlockData});
  } catch (error) {
    res.status(500).json({ error: 'Error 500' });
  }
});


/** RESERVE 
{
  "userId": "Test", 
  "name": "Test", 
  "seat": "A23"
}
 * **/

app.patch('/eventblock/reserve/:id_eventblock', async (req, res) => {
  try {
    const { id_eventblock } = req.params;
    const { userId, name, seat } = req.body;

    const eventBlockRef = db.collection('event_blocks').doc(id_eventblock);
    const eventBlockSnapshot = await eventBlockRef.get();

    const eventBlockData = eventBlockSnapshot.data();
    const takenSeatAssignments = eventBlockData.takenSeatAssignments

    /**Check if User Exists */
    const existingAssignment = takenSeatAssignments.find(
      (assignment) => assignment.userId === userId
    );
    if (existingAssignment) {
      return res.status(400).json({ error: 'User already has a seat assigned' });
    }

    const newAssignment = { userId, name, seat };
    takenSeatAssignments.push(newAssignment);

    const takenSeats = eventBlockData.takenSeats
    if (takenSeats.includes(seat)) {
      return res.status(400).json({ error: 'Seat already taken' });
    }
    else {
      takenSeats.push(seat);
    }

    await eventBlockRef.update({
      takenSeatAssignments,
      takenSeats,
    });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Error 500' });
  }
});



io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("echo", (msg) => {
    io.emit("echo", msg);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use((_req, res, _next) => {
  res.status(404).json({ code: -1, message: "Not found", data: null });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (
    err &&
    typeof err.status === "number" &&
    err.status >= 400 &&
    err.status <= 499
  ) {
    res.status(err.status).json({ code: -1, message: err.message, data: null });
  } else {
    res
      .status(err?.status ?? 500)
      .json({ code: -1, message: "Unknown error", data: null });
  }
});

server.listen(8080, () => {
  console.log("Listening on *:8080");
});
