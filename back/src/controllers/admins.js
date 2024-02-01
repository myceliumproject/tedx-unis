// @ts-check
import { Router } from "express";
import { FieldPath } from "firebase-admin/firestore";
import * as fs from "fs";
import { db } from "../db.js";
import { sendEmail } from "../email.js";
import { authenticated } from "../token.js";

const router = Router();

router.patch(
  "/update/block/:id_block",
  authenticated("staff"),
  async (req, res) => {
    try {
      const id = req.params.id_block;
      const data = req.body;

      await db.collection("event_blocks").doc(id).update(data);

      const eventBlocksSnapshot = await db.collection("event_blocks").get();
      const eventBlocks = [];

      eventBlocksSnapshot.forEach((doc) => {
        const { takenSeatAssignments, waitlist, ...eventBlockData } =
          doc.data();
        eventBlocks.push({ id: doc.id, ...eventBlockData });
      });

      res.status(200).json({ code: 0, data: eventBlocks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error 500" });
    }
  }
);

router.get("/report/:email", authenticated("admin"), async (req, res) => {
  try {
    const eventBlockSnapshot = await db.collection("event_blocks").get();

    const { email } = req.params;
    let attachments = [];

    for (const doc of eventBlockSnapshot.docs) {
      const { takenSeatAssignments, date, initial_time, final_time } =
        doc.data();
      let sorted = takenSeatAssignments.sort((a, b) => {
        return a.attended === b.attended ? 0 : a.attended ? -1 : 1;
      });

      const userIds = sorted.map((seat) => seat.userId);
      const userSnapshots =
        userIds.length > 0
          ? await db
              .collection("user")
              .where(FieldPath.documentId(), "in", userIds)
              .get()
          : { docs: [] };
      const emailsById = {};
      for (const userSnapshot of userSnapshots.docs) {
        emailsById[userSnapshot.id] = userSnapshot.data().email;
      }

      const filePath = `${date}-${initial_time}-${final_time}.csv`;
      const ebTxt = fs.createWriteStream(filePath);
      attachments.push({
        filename: filePath,
        path: `./${filePath}`,
        contentType: "text/csv",
      });
      ebTxt.write("Persona,Correo,Asistencia\r\n");
      sorted.forEach((seat) => {
        ebTxt.write(
          `${seat.name},${emailsById[seat.userId]},${
            seat.attended ? "Asistió" : "No Asistió"
          }\r\n`
        );
      });
    }

    sendEmail(
      email,
      "Reportes de Asistencia TEDxUNIS",
      `
        <div style="font-family: sans-serif; max-width: 60rem; margin: auto; text-align: center;">
        <img style="width: 30rem" src="${process.env.PUBLIC_SITE_URL}/tedxblack.png"/>
          <h3 style="color: #ae0036">
            Reporte de Asistencia TEDxUNIS
          </h3>
        </div>
        `,
      attachments
    );

    res.status(200).json({ code: 0, data: "Email Sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error 500" });
  }
});

export default router;
