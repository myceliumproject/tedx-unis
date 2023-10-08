// @ts-check
import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/** EMPTY EVENT BLOCKS **/
router.post("/", async (req, res) => {
  try {
    const eventBlock = {
      datetime: "",
      img: "", // URL
      events: [
        {
          name: "",
          speaker: "",
          description: "",
          speakerImg: "", // URL
        },
        {
          name: "",
          speaker: "",
          description: "",
          speakerImg: "", // URL
        },
        {
          name: "",
          speaker: "",
          description: "",
          speakerImg: "", // URL
        },
      ],
      takenSeats: [],
      takenSeatAssignments: [],
      waitlist: [],
    };

    const docRef = await db.collection("event_blocks").add(eventBlock);

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
});

/** GET ALL EVENT BLOCKS **/
router.get("/list", async (req, res) => {
  try {
    const eventBlocksSnapshot = await db.collection("event_blocks").get();
    const eventBlocks = [];

    eventBlocksSnapshot.forEach((doc) => {
      const eventBlockData = doc.data();
      eventBlocks.push({ id: doc.id, ...eventBlockData });
    });

    res.status(200).json({ code: 0, data: eventBlocks });
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
});

/** SPECIFIC EVENT BLOCK **/
router.get("/get/:eventBlockId", async (req, res) => {
  try {
    const { eventBlockId } = req.params;

    const eventBlockRef = db.collection("event_blocks").doc(eventBlockId);
    const eventBlockSnapshot = await eventBlockRef.get();
    const eventBlockData = eventBlockSnapshot.data();

    res.status(200).json({ code: 0, data: eventBlockData });
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
});

/** RESERVE 
{
  "userId": "Test", 
  "name": "Test", 
  "seat": "A23"
}
 * **/

router.patch("/reserve/:id_eventblock", async (req, res) => {
  try {
    const { id_eventblock } = req.params;
    const { userId, name, seat } = req.body;

    const eventBlockRef = db.collection("event_blocks").doc(id_eventblock);
    const eventBlockSnapshot = await eventBlockRef.get();

    const eventBlockData = eventBlockSnapshot.data();
    const takenSeatAssignments = eventBlockData.takenSeatAssignments;

    /**Check if User Exists */
    const existingAssignment = takenSeatAssignments.find(
      (assignment) => assignment.userId === userId
    );
    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "User already has a seat assigned" });
    }

    const newAssignment = { userId, name, seat };
    takenSeatAssignments.push(newAssignment);

    const takenSeats = eventBlockData.takenSeats;
    if (takenSeats.includes(seat)) {
      return res.status(400).json({ error: "Seat already taken" });
    } else {
      takenSeats.push(seat);
    }

    await eventBlockRef.update({
      takenSeatAssignments,
      takenSeats,
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
});

export default router;
