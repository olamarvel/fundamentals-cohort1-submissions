import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  setTimeout(next, 200 + Math.random() * 3000);
});

app.get("/api/users.php", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "data/v1_users.json"),
    "utf-8"
  );
  res.json(JSON.parse(data));
});

app.get("/api/posts.php", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "data/v1_posts.json"),
    "utf-8"
  );
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Legacy Mock API running at http://localhost:${PORT}`);
  console.log(`=>http://localhost:${PORT}/api/users.php`);
  console.log(`=>http://localhost:${PORT}/api/posts.php`);
});
