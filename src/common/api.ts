import { ErrorResponse } from "@/common/types/error/error-response";
import { PasteWithContent } from "@/types/paste";
import ky from "ky";

/**
 * Uploads a new paste.
 *
 * @param content the content of the paste.
 * @param expires the expiration time in seconds.
 * @param deleteAfterRead whether to delete the paste after first read.
 * @returns the response from the server or the error.
 */
export async function uploadPaste(
  content: string,
  expires?: number,
  deleteAfterRead?: boolean
): Promise<{ paste: PasteWithContent | null; error: ErrorResponse | null }> {
  const response = await ky.post<PasteWithContent | ErrorResponse>(
    "/api/upload",
    {
      body: content,
      searchParams: {
        ...(expires && expires > 0 ? { expires: expires } : {}),
        ...(deleteAfterRead ? { deleteAfterRead: "true" } : {}),
      },
      throwHttpErrors: false,
    }
  );

  if (response.status !== 200) {
    return { paste: null, error: (await response.json()) as ErrorResponse };
  }
  return { paste: await response.json(), error: null };
}

/**
 * Gets a paste by ID.
 *
 * @param id The ID of the paste to get.
 * @returns The response from the server.
 */
export function getPaste(id: string) {
  return ky.get<PasteWithContent>(`/api/paste/${id}`).json();
}
