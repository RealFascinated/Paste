import { Config } from "@/common/config";
import { expirePastes } from "@/common/prisma";
import { createServer } from "http";
import next from "next";
import { schedule } from "node-cron";
import { parse } from "url";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
const handle = app.getRequestHandler();

console.log(
  `> Starting ${process.env.NODE_ENV ?? "development"} server for Paste!`
);
app.prepare().then(() => {
  createServer(async (req, res) => {
    const before = performance.now();
    const url =
      req.url! == Config.hastebinUploadEndpoint ? "/api/upload" : req.url!;
    const parsedUrl = parse(url, true);
    await handle(req, res, parsedUrl);

    // Log the request to the console
    if (!dev && !parsedUrl.path?.includes("_next")) {
      console.log(
        ` ${req.method} ${parsedUrl.path} in ${(performance.now() - before).toFixed(2)}ms`
      );
    }
  }).listen(port);

  // Schedule the paste expiration every 5 minutes
  schedule("0 */5 * * * *", async () => {
    await expirePastes();
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
