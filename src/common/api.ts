import { ErrorResponse } from "@/common/types/error/error-response";
import { PasteWithContent } from "@/types/paste";

/**
 * Uploads a new paste.
 *
 * @param content the content of the paste.
 * @param expires the expiration time in seconds.
 * @returns the response from the server or the error.
 */
export async function uploadPaste(
  content: string,
  expires?: number
): Promise<{ paste: PasteWithContent | null; error: ErrorResponse | null }> {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: content,
    headers: {
      "Content-Type": "text/plain",
    },
    ...(expires && expires > 0 ? { searchParams: { expires: String(expires) } } : {}),
  });

  if (response.status !== 200) {
    return { paste: null, error: (await response.json()) as ErrorResponse | null };
  }
  return { paste: await response.json(), error: null };
}

/**
 * Gets a paste by ID.
 *
 * @param id The ID of the paste to get.
 * @returns The response from the server.
 */
export async function getPaste(id: string): Promise<PasteWithContent | null> {
  const response = await fetch(`/api/paste/${id}`);
  if (response.status !== 200) {
    return null;
  }
  return await response.json();
}
