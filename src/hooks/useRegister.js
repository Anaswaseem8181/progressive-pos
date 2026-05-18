import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../utils/registerValidation";
import { registerUser, reset } from "../redux/slices/authSlice";
import { notify } from "../utils/notifications";

export const useRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading: isReduxLoading, isError, message } = useSelector(
        (state) => state.auth
    );
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (isError) {
            notify.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerValidation),
    });

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(registerUser(data)).unwrap();
            notify.success("Account created! Let's set up your subscription.");
            navigate("/subscription", { state: { registrationData: result } });
        } catch (err) {
            // Error is handled by extraReducers and useEffect for notify.error
        }
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        navigate("/");
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isLoading: isReduxLoading,
        showCancelModal,
        handleCancel,
        confirmCancel,
        closeCancelModal
    };
};
