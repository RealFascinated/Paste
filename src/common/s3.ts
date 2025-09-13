import { Client } from "minio";
import { env } from "@/common/env";
import { Readable } from "node:stream";
import Logger from "./logger";

const minioClient = new Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT,
  useSSL: env.S3_USE_SSL,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
});

export default class S3Service {
  constructor() {
    (async () => {
      if (!(await minioClient.bucketExists(env.S3_BUCKET))) {
        await minioClient.makeBucket(env.S3_BUCKET);
        Logger.info(`Bucket ${env.S3_BUCKET} created`);
      }
    })();
  }

  /**
   * Gets the Minio client.
   *
   * @returns the Minio client
   */
  public static getMinioClient() {
    return minioClient;
  }

  /**
   * Gets a file from Minio.
   *
   * @param bucket the bucket to get the file from
   * @param filename the filename to get
   * @returns the file
   */
  public static async getFile(filename: string): Promise<Buffer | null> {
    try {
      const data = await minioClient.getObject(env.S3_BUCKET, filename);
      const chunks: Buffer[] = [];
      for await (const chunk of data) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch {
      return null;
    }
  }

  /**
   * Gets a file stream from Minio.
   *
   * @param bucket the bucket to get the file from
   * @param filename the filename to get
   * @returns the file stream
   */
  public static async getFileStream(filename: string): Promise<Readable> {
    return minioClient.getObject(env.S3_BUCKET, filename);
  }

  /**
   * Saves a file to Minio.
   *
   * @param bucket the bucket to save to
   * @param filename the filename to save as
   * @param data the data to save
   * @param contentType the content type of the file
   */
  public static async saveFile(filename: string, data: Buffer) {
    try {
      await minioClient.putObject(env.S3_BUCKET, filename, data);
    } catch (error) {
      Logger.error(`Failed to save file to Minio: ${error}`);
    }
  }

  /**
   * Removes a file from Minio.
   *
   * @param bucket the bucket to remove from
   * @param filename the filename to remove
   */
  public static async deleteFile(filename: string) {
    try {
      await minioClient.removeObject(env.S3_BUCKET, filename);
    } catch (error) {
      Logger.error(`Failed to delete file from Minio: ${error}`);
    }
  }
}