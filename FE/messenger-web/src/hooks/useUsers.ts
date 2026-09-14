import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { UserLoginRequest } from "@/types/user";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: UserLoginRequest) =>
      authService.login(data.email, data.pass),
  });
};
