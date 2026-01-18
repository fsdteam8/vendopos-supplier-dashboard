/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Backend login response shape
 */
interface BackendUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  image?: any;
}

interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: BackendUser;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const result: LoginResponse = await res.json();

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Login failed");
        }

        const { accessToken, refreshToken, user } = result.data;

        if (!accessToken || !refreshToken || !user) {
          throw new Error("Invalid login response from server");
        }

        /**
         * Returned object becomes `user` in jwt callback
         */
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.refreshToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.accessToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
