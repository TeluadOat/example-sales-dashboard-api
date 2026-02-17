#!/usr/bin/env node
const { exec } = require("child_process");

console.log("⏳ Pushing Prisma schema to database...");

exec("npx prisma db push --accept-data-loss", (err, stdout, stderr) => {
    if (err) {
        console.error("❌ Error pushing schema:", err.message);
        process.exit(1);
    }
    if (stderr) console.error("⚠️ Stderr:", stderr);
    console.log("✅ Schema push output:\n", stdout);
});
