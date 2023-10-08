import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

initializeApp({
  credential: cert(JSON.parse(readFileSync("./service-account.json"))),
});

export const db = getFirestore();
