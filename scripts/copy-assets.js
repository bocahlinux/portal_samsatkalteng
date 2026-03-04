const fs = require("fs");
const path = require("path");

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const item of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, item);
    const dest = path.join(destDir, item);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  }
}

const root = path.join(__dirname, "..");
const nm = path.join(root, "node_modules");
const pub = path.join(root, "public", "vendor");

copyDir(
  path.join(nm, "bootstrap", "dist"),
  path.join(pub, "bootstrap")
);

copyDir(
  path.join(nm, "bootstrap-icons", "font"),
  path.join(pub, "bootstrap-icons")
);

console.log("[assets] bootstrap + bootstrap-icons copied to public/vendor");