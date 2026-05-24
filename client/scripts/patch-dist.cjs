const fs = require("node:fs");
const path = require("node:path");

const indexPath = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  '<script defer src="$1"></script>'
);

fs.writeFileSync(indexPath, html);
