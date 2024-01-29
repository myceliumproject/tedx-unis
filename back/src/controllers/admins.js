// @ts-check
import { Router } from "express";
import { FieldPath } from "firebase-admin/firestore";
import * as fs from "fs";
import { db } from "../db.js";
import { sendEmail } from "../email.js";

const router = Router();

router.get("/report/:email", async (req, res) => {
  try {
    const eventBlockSnapshot = await db.collection("event_blocks").get();

    const { email } = req.params;
    let attachments = [];

    for (const doc of eventBlockSnapshot.docs) {
      const { takenSeatAssignments, datetime, ...eventBlockData } = doc.data();
      let sorted = takenSeatAssignments.sort((a, b) => {
        return a.attended ? -1 : 1;
      });

      const userIds = takenSeatAssignments.map((seat) => seat.userId);
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

      let ebTxt = fs.createWriteStream(`${datetime}.csv`);
      attachments.push({
        filename: `${datetime}.csv`,
        path: `./${datetime}.csv`,
        contentType: "text/csv",
      });
      ebTxt.write("Persona,Correo,Asistencia\r\n");
      takenSeatAssignments.forEach((seat) => {
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
        <img style="width: 30rem" src="${process.env.PUBLIC_SITE_URL}/tedxblack.svg"/>
          <h3 style="color: #ae0036">
            Reporte de Asistencia TEDxUNIS
          </h3>
        </div>
        `,
      attachments
    );

    res.status(200).json({ code: 0, data: "Email Sent" });
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
});

export default router;
