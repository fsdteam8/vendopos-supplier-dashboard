import { useMutation } from "@tanstack/react-query";
import { onboardService } from "../api";
import { toast } from "@/hooks/use-toast";

export const useOnboarding = () => {
  return useMutation({
    mutationFn: onboardService.createOnboardingLink,
    onSuccess: (data) => {
      console.log('redirect data',data?.success)
      if (data?.success && data?.data?.onboardingLink?.url) {
        window.open(data?.data?.onboardingLink.url, "_blank");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to get onboarding link",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create onboarding account",
        variant: "destructive",
      });
    },
  });
};

export const useGetStripeLink = () => {
  return useMutation({
    mutationFn: onboardService.getStripeLink,
    onSuccess: (data) => {
      if (data.success && data.data.url) {
        window.open(data.data.url, "_blank");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to get stripe link",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch stripe link",
        variant: "destructive",
      });
    },
  });
};

export const useRefreshOnboarding = () => {
  return useMutation({
    mutationFn: onboardService.refreshOnboarding,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Status refreshed successfully",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to refresh",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to refresh",
        variant: "destructive",
      });
    },
  });
};
