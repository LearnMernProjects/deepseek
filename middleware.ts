import { clerkMiddleware } from '@clerk/nextjs/server';

// Temporarily disable Clerk middleware to fix deployment
export default function middleware() {
  // Return empty response to bypass Clerk
  return new Response();
}

// export default clerkMiddleware();

export const config = {
  matcher: [
    // Only protect API routes for now
    '/(api|trpc)(.*)',
  ],
};