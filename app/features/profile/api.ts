import api from "@/lib/api/api";
import { GetProfileResponse, UpdateProfileResponse } from "./types";

export const getProfile = async (): Promise<GetProfileResponse> => {
  const response = await api.get<GetProfileResponse>("/user/my-profile");
  return response.data;
};

export const updateProfile = async (data: FormData): Promise<UpdateProfileResponse> => {
  const response = await api.put<UpdateProfileResponse>("/user/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
