import { Router } from "express";
import { db } from "../db.js";
import { handler } from "../middleware.js";

const router = Router();

const cachedInfo = {};
router.get(
  "/",
  handler(async (req, res) => {
    if (!cachedInfo.main) {
      const infoRef = await db.collection("info").doc("main").get();
      const data = infoRef.data();
      cachedInfo.main = data;
    }
    res.json({ code: 0, data: cachedInfo.main });
  })
);

export default router;
