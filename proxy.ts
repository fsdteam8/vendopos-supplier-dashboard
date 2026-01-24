import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|forget-password|reset-your-password|verify-otp|email-verify).*)",
  ],
};
