// @ts-check
import jwt from "jsonwebtoken";
import { db } from "./db.js";
import { handler } from "./middleware.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "pleasesetenvvarforsecurity";

const userTypeLevels = ["user", "staff", "admin"];

export function createUserToken(id, userType) {
  const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  return {
    token: jwt.sign(
      {
        exp: expiration,
        sub: id,
        userType,
      },
      TOKEN_SECRET
    ),
    expiration,
  };
}

/**
 *
 * @param {string} token
 * @returns {import("jsonwebtoken").JwtPayload}
 */
export function verifyUserToken(token) {
  try {
    // @ts-ignore
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
}

/**
 *
 * @param {"user" | "staff" | "admin"} userType
 * @param {boolean} getUser
 * @returns
 */
export function authenticated(userType, getUser = true) {
  return handler(async (req, res, next) => {
    /** @type {string} */
    // @ts-ignore
    const token = req.headers["x-access-token"];
    const parsedToken = verifyUserToken(token);
    if (parsedToken === null) {
      res.status(403).json({ code: -1, message: "Forbidden" });
      return;
    }
    if (
      userTypeLevels.indexOf(parsedToken.userType) <
      userTypeLevels.indexOf(userType)
    ) {
      res.status(401).json({ code: -1, message: "Unauthorized" });
      return;
    }

    if (getUser) {
      const userSs = await db.collection("user").doc(parsedToken.sub).get();
      if (userSs.exists) {
        // @ts-ignore
        req.user = { ...userSs.data(), id: userSs.id };
      }
    }

    next();
  });
}

export function generateTicketToken(userId, blockId, seat) {
  return jwt.sign(
    {
      sub: userId,
      userBlock: blockId,
      userSeat: seat,
    },
    TOKEN_SECRET
  );
}

/**
 *
 * @param {string} token
 * @returns {import("jsonwebtoken").JwtPayload}
 */
export function verifyTicketToken(token) {
  try {
    // @ts-ignore
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
}
