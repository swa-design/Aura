import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetAuthUrl,
  handleOAuthCallback,
  handleGetLabels,
  handleGetEmails,
  handleSendEmail,
  handleModifyEmail
} from "./routes/gmail";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Gmail API routes
  app.get("/api/gmail/auth-url", handleGetAuthUrl);
  app.get("/api/gmail/callback", handleOAuthCallback);
  app.get("/api/gmail/labels", handleGetLabels);
  app.get("/api/gmail/emails", handleGetEmails);
  app.post("/api/gmail/send", handleSendEmail);
  app.post("/api/gmail/emails/:id/modify", handleModifyEmail);

  return app;
}
