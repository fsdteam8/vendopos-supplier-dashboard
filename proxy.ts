import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // optional custom logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /**
     * Protect everything EXCEPT:
     * - api routes
     * - next static files
     * - next image optimizer
     * - public assets
     * - auth pages
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|uploads|login|forget-password|reset-your-password|verify-otp|email-verify).*)",
  ],
};
