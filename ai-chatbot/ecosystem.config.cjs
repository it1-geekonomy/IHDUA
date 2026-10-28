const path = require("path");

module.exports = {
  apps: [
    {
      name: "ihdua-ai",
      script: path.join(__dirname, "run.py"),
      interpreter: path.join(__dirname, "venv", "Scripts", "python.exe"),
      cwd: __dirname,
      autorestart: true,
      watch: false,
    },
  ],
};
