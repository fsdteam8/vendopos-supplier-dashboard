import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
     const {pathname}=req.nextUrl;
     const token=req.nextauth.token;

     if(pathname==='/' || pathname.startsWith('/dashboard')){
      if(token?.role !=='supplier'){
        return NextResponse.redirect(new URL('/login',req.url));
      }
    }


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
