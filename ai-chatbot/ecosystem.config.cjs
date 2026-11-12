const path = require("path");

const isWin = process.platform === "win32";
const pythonPath = isWin
  ? path.join(__dirname, "venv", "Scripts", "python.exe")
  : path.join(__dirname, "venv", "bin", "python");

module.exports = {
  apps: [
    {
      name: "ihdua-ai",
      script: path.join(__dirname, "run.py"),
      interpreter: pythonPath,
      cwd: __dirname,
      autorestart: true,
      watch: false,
    },
  ],
};
