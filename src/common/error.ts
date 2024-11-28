/**
 * Build a response with an error.
 *
 * @param error the error to return
 * @param status the status code to return
 */
export const buildErrorResponse = (error: string, status: number): Response => {
    return Response.json({ error, code: status }, { status });
};
