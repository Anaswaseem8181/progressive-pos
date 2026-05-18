import { useDispatch, useSelector } from "react-redux";
import { logoutUser, loginUser } from "../redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logoutUser()),
  };
};
