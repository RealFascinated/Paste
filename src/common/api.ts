import ky from "ky";
import { Paste } from "@/types/paste";
import { Config } from "@/common/config";
import { Page } from "@/common/pagination/pagination";
import SuperJSON from "superjson";
import { UserStatistics } from "@/common/types/user/paste-statistics";
import {ErrorResponse} from "@/common/types/error/error-response";

/**
 * Uploads a new paste.
 *
 * @param content the content of the paste.
 * @param expires the expiration time in seconds.
 * @returns the response from the server or the error.
 */
export async function uploadPaste(content: string, expires?: number): Promise<{ paste: Paste | null, error: ErrorResponse | null }> {
  const response = await ky
    .post<Paste | ErrorResponse>("/api/upload", {
      body: content,
      searchParams: {
        ...(expires && expires > 0 ? { expires: expires } : {}),
      },
      throwHttpErrors: false,
    })

  if (response.status !== 200) {
    return { paste: null, error: await response.json() as ErrorResponse };
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
  return ky.get<Paste>(`/api/paste/${id}`).json();
}

/**
 * Gets the pastes for the logged-in user.
 *
 * @param page the page to fetch.
 * @returns the pastes for the page.
 */
export async function getLoggedInUsersPastes(page: number) {
  const response = await ky
    .get(`${Config.siteUrl}/api/user/pastes`, {
      searchParams: {
        page: page,
      },
    })
    .text();
  if (!response) {
    return;
  }

  return SuperJSON.parse<Page<Paste>>(response);
}

/**
 * Gets the paste statistics for the logged-in user.
 *
 * @returns the statistics for the user.
 */
export async function getLoggedInUsersPasteStatistics() {
  return ky
    .get<UserStatistics>(`${Config.siteUrl}/api/user/pastes/stats`)
    .json();
}
