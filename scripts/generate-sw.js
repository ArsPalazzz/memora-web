/**
 * Generates public/firebase-messaging-sw.js from template + VITE_FIREBASE_* env vars.
 * Run before dev/build (see package.json scripts).
 */
import { readFileSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

function env(name) {
  const value = process.env[name];
  if (!value) return "";
  return value.replace(/^["']|["']$/g, "");
}

const template = readFileSync(
  "./public/firebase-messaging-sw-template.js",
  "utf8",
);

const swContent = template
  .replace("{{FIREBASE_API_KEY}}", env("VITE_FIREBASE_API_KEY"))
  .replace("{{FIREBASE_AUTH_DOMAIN}}", env("VITE_FIREBASE_AUTH_DOMAIN"))
  .replace("{{FIREBASE_PROJECT_ID}}", env("VITE_FIREBASE_PROJECT_ID"))
  .replace(
    "{{FIREBASE_MESSAGING_SENDER_ID}}",
    env("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  )
  .replace("{{FIREBASE_APP_ID}}", env("VITE_FIREBASE_APP_ID"));

writeFileSync("./public/firebase-messaging-sw.js", swContent);

console.log("Generated public/firebase-messaging-sw.js");
