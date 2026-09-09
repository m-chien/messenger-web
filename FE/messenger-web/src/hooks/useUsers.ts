import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/services/userService';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
