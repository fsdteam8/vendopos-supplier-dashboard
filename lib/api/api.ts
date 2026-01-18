import axios from "axios";

import { getSession } from "next-auth/react";
import {
  AuthResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  GenericResponse,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
  VerifyOtp,
  VerifyOtpInput,
  VerifyOtpResponse,
} from "@/types/auth";
import { User } from "next-auth";

// import { da } from "zod/v4/locales";
// import { Cagliostro } from "next/font/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session?.accessToken}`;
    } else {
      console.warn("No token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// register

export async function registerUser(data: RegisterInput) {
  console.log('form data',data)
  try {
    const res = await api.post(`/user/register`, data);

    return res.data;
  } catch (err) {
    console.log('hello')
    if (err instanceof Error) {
      throw new Error(err.message || "fail to register ");
    }
  }
}
export async function verifyEmail({ token, otp }: VerifyEmailInput) {
  try {
    const res = await api.post(
      `/user/verify-email`,
      { otp: otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "fail to register ");
    }
  }
}

export async function forgetPassword(email: string) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

export async function verifyOtp({
  otp,
  email,
  token,
}: VerifyOtp): Promise<VerifyOtpResponse> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const body: Record<string, string> = { otp };
  if (email) body.email = email;

  const res = await api.post<VerifyOtpResponse>("/auth/verify-otp", body, {
    headers,
  });
  return res.data;
}

export const authService = {
  // Login
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", input);
    return response.data;
  },

  // Register
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/user/register", input);
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (input: VerifyOtpInput): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      input
    );
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (
    input: ForgotPasswordInput
  ): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>(
      "/auth/forgot-password",
      input
    );
    return response.data;
  },

  // Reset Password
  resetPassword: async (
    token: string,
    input: ResetPasswordInput
  ): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>(
      "/auth/reset-password",
      input,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Change Password
  changePassword: async (
    input: ChangePasswordInput
  ): Promise<GenericResponse> => {
    const response = await api.post<GenericResponse>(
      "/auth/change-password",
      input
    );
    return response.data;
  },

  // Get Current User Profile
  getMe: async (): Promise<{ data: User }> => {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data;
  },

  // Get All Users (Admin?)
  getAllUsers: async (): Promise<{ data: User[] }> => {
    const response = await api.get<{ data: User[] }>("/users");
    return response.data;
  },

  // Get User Conversation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserConversation: async (userId: string): Promise<{ data: any[] }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<{ data: any[] }>(`/conversations/${userId}`);
    return response.data;
  },
};