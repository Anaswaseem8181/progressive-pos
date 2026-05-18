import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../redux/slices/authSlice";
import { notify } from "../utils/notifications";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      notify.error(message || "Invalid Credentials");
      
      // If the backend says payment is needed, we could redirect here, 
      // but usually the user should go to /subscription manually or we can guide them.
      if (message?.includes('activation required')) {
        // Option to redirect to subscription if we have the data
      }
    }

    if (user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    } else {
      notify.error("Please fill in all fields");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading
  };
};
