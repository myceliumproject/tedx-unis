// @ts-check
import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/** @type {[string[], string[], string[]][]} */
const seatArrangement = [
  [[],["K1","K2","K3","K4","K5","K6","K7","K8","K9","K10"],[]], // prettier-ignore
  [["J1","J2","J3"],["J4","J5","J6","J7","J8","J9","J10","J11","J12","J13","J14"],["J15","J16","J17"]], // prettier-ignore
  [["I1","I2","I3","I4"],["I5","I6","I7","I8","I9","I10","I11","I12","I13","I14","I15","I16","I17","I18","I19","I20","I21"],["I22","I23","I24","I25"]], // prettier-ignore
  [["H1","H2","H3","H4","H5"],["H6","H7","H8","H9","H10","H11","H12","H13","H14","H15","H16","H17","H18","H19","H20","H21"],["H22","H23","H24","H25","H26"]], // prettier-ignore
  [["G1","G2","G3","G4","G5"],["G6","G7","G8","G9","G10","G11","G12","G13","G14","G15","G16","G17","G18","G19","G20"],["G21","G22","G23","G24","G25"]], // prettier-ignore
  [["F1","F2","F3","F4","F5","F6"],["F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20"],["F21","F22","F23","F24","F25","F26"]], // prettier-ignore
  [["E1","E2","E3","E4","E5"],["E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18"],["E19","E20","E21","E22","E23"]], // prettier-ignore
  [["D1","D2","D3","D4","D5"],["D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16","D17"],["D18","D19","D20","D21","D22"]], // prettier-ignore
  [["C1","C2","C3","C4","C5"],["C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16"],["C17","C18","C19","C20","C21"]], // prettier-ignore
  [["B1","B2","B3","B4","B5"],["B6","B7","B8","B9","B10","B11","B12","B13","B14","B15"],["B16","B17","B18","B19","B20"]], // prettier-ignore
  [["A1","A2","A3","A4"],["A5","A6","A7","A8","A9","A10","A11","A12","A13"],["A14","A15","A16","A17"]], // prettier-ignore
];

function getBlockedRow(taken) {
  let lastReservedRow =
    taken
      .map((s) => s[0])
      .sort()
      .reverse()[0] ?? "A";
  if (lastReservedRow < "C") lastReservedRow = "C";

  let totalSeats = 0;
  let takenSeats = 0;
  for (const row of seatArrangement) {
    for (const side of row) {
      for (const seat of side) {
        if (seat[0] <= lastReservedRow) {
          totalSeats += 1;
          if (taken.includes(seat)) {
            takenSeats += 1;
          }
        }
      }
    }
  }

  let blockedRow;
  if (takenSeats / totalSeats < 0.6) {
    if (lastReservedRow <= "C") {
      blockedRow = "D";
    } else {
      blockedRow = String.fromCharCode(lastReservedRow.charCodeAt(0) + 1);
    }
  } else {
    if (lastReservedRow <= "C") {
      blockedRow = "E";
    } else {
      blockedRow = String.fromCharCode(lastReservedRow.charCodeAt(0) + 2);
    }
  }

  if (blockedRow > "K") {
    return "K";
  } else {
    return blockedRow;
  }
}

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

    const takenSeats = eventBlockData.takenSeats;
    if (takenSeats.includes(seat)) {
      return res.status(400).json({ error: "Seat already taken" });
    }

    const blockedRow = getBlockedRow(eventBlockData.takenSeats);
    console.log(seat, blockedRow);
    if (seat[0] >= blockedRow) {
      return res.status(400).json({ error: "Seat blocked" });
    }

    const newAssignment = { userId, name, seat };
    takenSeatAssignments.push(newAssignment);
    takenSeats.push(seat);

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
