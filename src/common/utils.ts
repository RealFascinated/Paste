import { type ClassValue, clsx } from "clsx";
import { IncomingMessage } from "http";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the IP address of the request.
 *
 * @param req the request to get the IP address from
 * @returns the IP address of the request
 */
export function getIP(req: Request | IncomingMessage | NextRequest) {
  const headers = req.headers;
  if (!headers) return "127.0.0.1";
  
  const getHeader = (name: string) => {
    if ('get' in headers && typeof headers.get === 'function') {
      return headers.get(name) ?? undefined;
    }
    const value = (headers as Record<string, string | string[] | undefined>)[name];
    return Array.isArray(value) ? value[0] : value ?? undefined;
  };
  
  // Debug: log available headers in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Available headers:', Object.keys(headers));
    console.log('CF-Connecting-IP:', getHeader("CF-Connecting-IP"));
    console.log('X-Forwarded-For:', getHeader("X-Forwarded-For"));
    console.log('X-Real-IP:', getHeader("X-Real-IP"));
  }
  
  return (
    getHeader("CF-Connecting-IP") ??
    getHeader("X-Forwarded-For") ??
    getHeader("X-Real-IP") ??
    // For IncomingMessage, try to get the socket remote address
    ('socket' in req && req.socket?.remoteAddress) ??
    "127.0.0.1"
  );
}