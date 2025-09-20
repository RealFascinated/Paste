import { Config } from "@/common/config";
import { expirePastes } from "@/common/prisma";
import { createServer } from "http";
import next from "next";
import { schedule } from "node-cron";
import { parse } from "url";
import Logger from "./common/logger";
import S3Service from "./common/s3";
import { getIP } from "./common/utils";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
const handle = app.getRequestHandler();

Logger.info(
  `> Starting ${process.env.NODE_ENV ?? "development"} server for Paste!`
);
app.prepare().then(() => {
  new S3Service();

  createServer(async (req, res) => {
    const before = performance.now();
    const url =
      req.url! == Config.hastebinUploadEndpoint ? "/api/upload" : req.url!;
    const parsedUrl = parse(url, true);
    await handle(req, res, parsedUrl);

    // Log the request to the console
    if (!dev && !parsedUrl.path?.includes("_next")) {
      const statusCode = res.statusCode || 200;

      Logger.infoWithTiming(
        `[${req.method} - ${getIP(req)}] ${parsedUrl.path} ${statusCode}`,
        before
      );
    }
  }).listen(port);

  // Schedule the paste expiration
  schedule("0 */1 * * * *", async () => {
    await expirePastes();
  });

  Logger.info(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
