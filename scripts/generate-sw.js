import { readFileSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const template = readFileSync(
  "./public/firebase-messaging-sw-template.js",
  "utf8"
);

const swContent = template
  .replace("{{FIREBASE_API_KEY}}", process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  .replace(
    "{{FIREBASE_AUTH_DOMAIN}}",
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  )
  .replace(
    "{{FIREBASE_PROJECT_ID}}",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )
  .replace(
    "{{FIREBASE_MESSAGING_SENDER_ID}}",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  )
  .replace("{{FIREBASE_APP_ID}}", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

writeFileSync("./public/firebase-messaging-sw.js", swContent);
