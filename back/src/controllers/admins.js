// @ts-check
import unoconv from "better-unoconv";
import Docxtemplater from "docxtemplater";
import { Router } from "express";
import * as fs from "fs";
import PizZip from "pizzip";
import { tmpNameSync } from "tmp";
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
      const {
        takenSeatAssignments: _takenSeatAssignments,
        takenSeats: _takenSeats,
        waitlist: _waitlist,
        id: _id,
        ...data
      } = req.body;

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
        userIds.length > 0 ? await db.collection("user").get() : { docs: [] };
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
      "Reportes de Asistencia IntegraRSE",
      `
        <div style="font-family: sans-serif; max-width: 60rem; margin: auto; text-align: center;">
        <img style="width: 30rem" src="${process.env.PUBLIC_SITE_URL}/integrarse-black.png"/>
          <h3 style="color: #006400">
            Reporte de Asistencia IntegraRSE
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

router.get("/cert/:block", authenticated("admin"), async (req, res) => {
  try {
    const { block } = req.params;
    const db_block = (
      await db.collection("event_blocks").doc(block).get()
    ).data();
    let filtered = db_block.takenSeatAssignments.filter((e) => e.attended);

    const tempate = fs.readFileSync("./Document1.docx", "binary");
    const zip = new PizZip(tempate);
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
    });

    for (const u of filtered) {
      const userData = (await db.collection("user").doc(u.userId).get()).data();
      doc.render({
        username: userData.name,
      });

      const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      });

      const docx_result = tmpNameSync({ postfix: ".docx" });
      const pdf_result = tmpNameSync({ postfix: ".pdf" });
      fs.writeFileSync(docx_result, buf);

      await new Promise((resolve, reject) =>
        unoconv.convert(docx_result, "pdf", {}, function (err, res) {
          if (err) reject(err);
          fs.writeFileSync(pdf_result, res);
          resolve();
        })
      );

      await sendEmail(
        userData.email,
        "Certificado de Asistencia Foro IntegraRSE",
        `
          <div style="font-family: sans-serif; max-width: 60rem; margin: auto; text-align: center;">
          <img style="width: 30rem" src="${process.env.PUBLIC_SITE_URL}/integrarse-black.png"/>
            <h3 style="color: #006400">
              Certificado de Asistencia IntegraRSE: Estrategias integrales y sostenibles para la Responsabilidad Empresarial
            </h3>
          </div>
          `,
        [
          {
            filename: pdf_result,
            path: pdf_result,
            contentType: "applicaation/pdf",
          },
        ]
      );
    }

    res.json({ code: 0, data: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error 500" });
  }
});

export default router;
