// @ts-check
import { Router } from "express";
import { db } from "../db.js";
import { emailSpecs, transporter } from "../email.js";
import { handler } from "../middleware.js";
import { authenticated, createUserToken } from "../token.js";

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

  let mailSpecs = emailSpecs(
    req.body.email,
    "Código de Verificación",
    `<div style="font-family: sans-serif; max-width: 60rem; margin: auto; text-align: center;"><img style="width: 30rem" src="${process.env.PUBLIC_SITE_URL}/tedxblack.png"/><p>Se ha hecho un intento de autenticación para su correo. Su código de verificación es:</p><p style="font-size: 2rem; font-weight: bold">${emailCodes[email].code}</p><p>Si usted no realizó este intento, puede ignorar este correo</p><p style="font-size: 0.8rem; color: gray">Powered by: Mycelium <img style="width: 1rem" src="${process.env.PUBLIC_SITE_URL}/mycelium.png"/></p></div>`
  );

  transporter.sendMail(mailSpecs, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Email could not be sent" });
    } else {
      return res
        .status(200)
        .json({ code: 0, message: "Email sent successfully" });
    }
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
    /** @type {{ id: string; userType: "user" | "staff" | "admin" }} */
    let foundUser;
    if (foundUsers.docs.length > 0) {
      // @ts-expect-error data() doesn't have the appropriate typing for this
      foundUser = { ...foundUsers.docs[0].data(), id: foundUsers.docs[0].id };
    } else {
      const userRef = await db.collection("user").add({
        email: email,
        name: savedCode.name,
        tickets: [],
        waitlist: [],
        userType: "user",
      });
      const userSs = await userRef.get();
      // @ts-expect-error data() doesn't have the appropriate typing for this
      foundUser = { ...userSs.data(), id: userSs.id };
    }

    const { token, expiration } = createUserToken(
      foundUser.id,
      foundUser.userType
    );

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

router.post("/changetype", authenticated("admin", false), async (req, res) => {
  const { userId, type } = req.body;

  const foundUserRef = await db.collection("user").doc(userId);

  foundUserRef.update({
    userType: type,
  });

  res.json({ code: 0, data: null });
});

router.get("/list", authenticated("staff", false), async (req, res) => {
  const foundUsers = await db.collection("user").get();

  res.json({
    code: 0,
    data: foundUsers.docs.map((d) => ({ ...d.data(), id: d.id })),
  });
});

export default router;
