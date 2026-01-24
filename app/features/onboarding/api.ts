import api from "@/lib/api/api";
import { OnboardingResponse } from "./types";

export const onboardService = {
  createOnboardingLink: async (): Promise<OnboardingResponse> => {
    const response = await api.get<OnboardingResponse>("/onboard/create");
    return response.data;
  },
  getStripeLink: async (): Promise<OnboardingResponse> => {
    const response = await api.get<OnboardingResponse>("/onboard/get-stripe-link");
    return response.data;
  },
  refreshOnboarding: async (): Promise<any> => {
    const response = await api.get<any>("/onboard/refresh");
    return response.data;
  },
};
