import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../service-account.json";

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
