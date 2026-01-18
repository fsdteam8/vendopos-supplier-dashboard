import api from "@/lib/api/api";
import { GetProfileResponse } from "./types";

export const getProfile = async (): Promise<GetProfileResponse> => {
  const response = await api.get<GetProfileResponse>("/user/my-profile");
  return response.data;
};
