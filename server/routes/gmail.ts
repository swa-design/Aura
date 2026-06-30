
import { google } from "googleapis";
import { RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:8080/api/gmail/callback"
);

// Scopes for Gmail API
const SCOPES = [
  "https://mail.google.com/", // Full access to Gmail
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.labels"
];

// Store tokens temporarily (in a real app, use a database)
let storedTokens: any = null;

// Get authorization URL
export const handleGetAuthUrl: RequestHandler = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
  res.json({ url: authUrl });
};

// Handle OAuth callback
export const handleOAuthCallback: RequestHandler = async (req, res) => {
  try {
    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    storedTokens = tokens;
    oauth2Client.setCredentials(tokens);
    res.redirect("/emails");
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
};

// Helper to get Gmail client
const getGmailClient = () => {
  if (storedTokens) {
    oauth2Client.setCredentials(storedTokens);
  }
  return google.gmail({ version: "v1", auth: oauth2Client });
};

// Get labels
export const handleGetLabels: RequestHandler = async (req, res) => {
  try {
    const gmail = getGmailClient();
    const response = await gmail.users.labels.list({ userId: "me" });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ error: "Failed to fetch labels" });
  }
};

// Get emails
export const handleGetEmails: RequestHandler = async (req, res) => {
  try {
    const gmail = getGmailClient();
    const labelIds = (req.query.labelIds as string)?.split(",") || ["INBOX"];
    const maxResults = parseInt(req.query.maxResults as string) || 20;
    const pageToken = req.query.pageToken as string;

    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds,
      maxResults,
      pageToken
    });

    const messages = response.data.messages || [];
    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const msgData = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "full"
        });
        return msgData.data;
      })
    );

    res.json({
      messages: detailedMessages,
      nextPageToken: response.data.nextPageToken
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};

// Send email
export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, body, cc, bcc } = req.body;
    const gmail = getGmailClient();

    // Create email message
    const messageParts = [
      `To: ${to}`,
      subject && `Subject: ${subject}`,
      cc && `Cc: ${cc}`,
      bcc && `Bcc: ${bcc}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      body
    ].filter(Boolean);

    const message = messageParts.join("\n");
    const encodedMessage = Buffer.from(message).toString("base64url");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// Modify email (star, mark read, etc.)
export const handleModifyEmail: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { addLabelIds, removeLabelIds } = req.body;
    const gmail = getGmailClient();

    const response = await gmail.users.messages.modify({
      userId: "me",
      id,
      requestBody: { 
        addLabelIds, 
        removeLabelIds 
      }
    } as any);

    res.json(response.data);
  } catch (error) {
    console.error("Error modifying email:", error);
    res.status(500).json({ error: "Failed to modify email" });
  }
};
