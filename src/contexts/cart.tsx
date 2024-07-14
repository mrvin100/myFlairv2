// contexts/user.tsx
import { useUserContext } from "./user";

export const getUser = () => {
  const { user } = useUserContext();
  return user;
};
