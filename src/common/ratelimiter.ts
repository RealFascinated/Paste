type RateLimitConfig = {
    windowMs: number;
    maxRequests: number;
};

type RateLimitInfo = {
    count: number;
    lastReset: number;
    expiresAt: number;
};

export type RateLimitResponse = {
    allowed: boolean;
    remainingRequests: number;
    resetTime: number;
};

export class Ratelimiter {
    private static CLEANUP_INTERVAL = 1000 * 60 * 5; // 5 Minutes

    private static routeConfigs: Map<string, RateLimitConfig> = new Map();
    private static limits: Map<string, RateLimitInfo> = new Map();
    private static lastCleanup: number = Date.now();

    /**
     * Configure the rate limit for a route.
     *
     * @param route the route to configure
     * @param config the rate limit config
     */
    static configRoute(route: string, config: RateLimitConfig) {
        this.routeConfigs.set(route, config);
    }

    /**
     * Check the rate limit for a request.
     *
     * @param request the request to check
     * @param route the route to check
     */
    static check(
        request: Request,
        route: string
    ): RateLimitResponse | undefined {
        const now: number = Date.now();

        // Clean up the limits map
        if (now - this.lastCleanup >= this.CLEANUP_INTERVAL) {
            this.lastCleanup = now;
            this.limits.forEach((limitInfo, key) => {
                if (now >= limitInfo.expiresAt) {
                    this.limits.delete(key);
                }
            });
        }

        // Get the route config
        const routeConfig: RateLimitConfig | undefined =
            this.routeConfigs.get(route);
        if (!routeConfig) return undefined;

        // Get the user's IP address to use as the key
        const ip: string =
            request.headers.get("CF-Connecting-IP") ||
            request.headers.get("X-Forwarded-For") ||
            "127.0.0.1";
        const key = `${route}:${ip}`;

        // If there is no limit info or the limit has expired, create a new one
        let limitInfo: RateLimitInfo | undefined = this.limits.get(key);
        if (!limitInfo || now >= limitInfo.expiresAt) {
            limitInfo = {
                count: 0,
                lastReset: now,
                expiresAt: now + routeConfig.windowMs,
            };
        }

        // Increment counter
        limitInfo.count++;
        this.limits.set(key, limitInfo);

        // Return the response
        const remaining: number = Math.max(
            0,
            routeConfig.maxRequests - limitInfo.count
        );
        const resetTime: number = limitInfo.lastReset + routeConfig.windowMs;
        return {
            allowed: limitInfo.count <= routeConfig.maxRequests,
            remainingRequests: remaining,
            resetTime,
        };
    }

    /**
     * Apply rate limit headers to a response.
     *
     * @param response the response to apply headers to
     * @param rateLimitResponse the rate limit response
     */
    static applyHeaders(
        response: Response,
        rateLimitResponse: RateLimitResponse
    ) {
        response.headers.set(
            "X-RateLimit-Remaining",
            `${rateLimitResponse.remainingRequests}`
        );
        response.headers.set(
            "X-RateLimit-Reset",
            `${rateLimitResponse.resetTime}`
        );
        return response;
    }
}
