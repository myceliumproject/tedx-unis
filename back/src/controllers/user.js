// @ts-check
import { Router } from "express";
import { db } from "../db.js";
import { handler } from "../middleware.js";
import { createUserToken } from "../token.js";

const router = Router();

function randomCode(n = 6) {
  let res = "";
  for (let i = 0; i < n; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
}

const emailCodes = {};

router.post("/authrequest", (req, res) => {
  const email = req.body.email;

  emailCodes[email] = {
    name: req.body.name,
    code: randomCode(),
  };

  res.json({
    code: 0,
    data:
      process.env.NODE_ENV === "development" ? emailCodes[email].code : null,
  });
});

router.post(
  "/auth",
  handler(async (req, res) => {
    const email = req.body.email;
    const savedCode = emailCodes[email];

    if (!savedCode || savedCode.code !== req.body.code) {
      res.json({
        code: 1,
        message: "Wrong email or code",
        data: null,
      });
      return;
    }

    const foundUsers = await db
      .collection("user")
      .where("email", "==", email)
      .get();
    let foundUser;
    if (foundUsers.docs.length > 0) {
      foundUser = { ...foundUsers.docs[0].data(), id: foundUsers.docs[0].id };
    } else {
      const userRef = await db.collection("user").add({
        email: email,
        name: savedCode.name,
        tickets: [],
        waitlist: [],
      });
      const userSs = await userRef.get();
      foundUser = { ...userSs.data(), id: userSs.id };
    }

    const { token, expiration } = createUserToken(foundUser.id);

    res.json({
      code: 0,
      data: {
        ...foundUser,
        token,
        tokenExp: expiration,
      },
    });
  })
);

export default router;
