import api from "@/lib/api/api";
import { ChangePasswordPayload, ChangePasswordResponse } from "./types";

export const changePassword = async (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  const response = await api.post<ChangePasswordResponse>("/auth/change-password", data);
  return response.data;
};
