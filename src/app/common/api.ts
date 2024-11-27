import ky from "ky";
import { Paste } from "@prisma/client";
import { Config } from "@/app/common/config";

/**
 * Uploads a new paste.
 *
 * @param content The content of the paste.
 * @param expiresAt The expiration date of the paste.
 * @returns The response from the server.
 */
export function uploadPaste(content: string, expiresAt?: Date) {
  return ky
    .post<Paste>(`${Config.websiteUrl}/api/upload`, {
      body: content,
      searchParams: {
        ...(expiresAt ? { expiresAt: expiresAt.toISOString() } : {}),
      },
    })
    .json();
}

/**
 * Gets a paste by ID.
 *
 * @param id The ID of the paste to get.
 * @returns The response from the server.
 */
export function getPaste(id: string) {
  return ky.get<Paste>(`${Config.websiteUrl}/api/paste/${id}`).json();
}
