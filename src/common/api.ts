import ky from "ky";
import { Paste } from "@/types/paste";

/**
 * Uploads a new paste.
 *
 * @param content the content of the paste.
 * @param expires the expiration time in seconds.
 * @returns the response from the server.
 */
export function uploadPaste(content: string, expires?: number) {
  return ky
    .post<Paste>("/api/upload", {
      body: content,
      searchParams: {
        ...(expires && expires > 0 ? { expires: expires } : {}),
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
  return ky.get<Paste>(`/api/paste/${id}`).json();
}
