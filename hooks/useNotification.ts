import { getAllNotifications, markNotificationAsViewed } from "@/lib/api/notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";




export const useAllNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["all-notifications", userId],
    queryFn: () => getAllNotifications(userId),
    enabled: !!userId,
  });
};

export const useMarkNotificationAsViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markNotificationAsViewed(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
    },
  });
};
