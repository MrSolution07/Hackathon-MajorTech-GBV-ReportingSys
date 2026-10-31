import bcrypt from "bcryptjs";
import { stdin, stderr } from "node:process";

function readSecret() {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "")));
      stdin.on("error", reject);
      return;
    }
    stderr.write("Type the new password and press Enter. It will not be shown.\n");
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          stdin.setRawMode(false);
          process.exit(1);
        }
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stderr.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

const password = await readSecret();
if (!password) {
  stderr.write("No password was read. Nothing was hashed.\n");
  process.exit(1);
}
process.stdout.write(`${bcrypt.hashSync(password, 12)}\n`);
