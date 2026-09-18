import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ihdua-ai-chatbot" });
});

app.post("/chat", (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";

  res.json({
    reply: message
      ? `IHDUA chatbot received: ${message}`
      : "Send a JSON body with a `message` field.",
  });
});

app.listen(PORT, () => {
  console.log(`AI chatbot running at http://localhost:${PORT}`);
});
