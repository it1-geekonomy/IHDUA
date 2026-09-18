import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ihdua-backend" });
});

app.get("/api", (_req, res) => {
  res.json({ message: "IHDUA API" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
