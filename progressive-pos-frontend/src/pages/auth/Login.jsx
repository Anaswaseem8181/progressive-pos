import React, { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthSplitLayout from "../../components/common/AuthSplitLayout";
import LoginBrandPanel from "../../components/auth/LoginBrandPanel";
import LoginForm from "../../components/auth/LoginForm";
import ForgotPasswordModal from "../../components/modals/auth/ForgotPasswordModal";
import { useState } from "react";

const Login = () => {
	const { email, setEmail, password, setPassword, handleSubmit, isLoading } = useLogin();
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate]);

	const businessName = location.state?.registrationData?.businessName;

	return (
		<>
			<AuthSplitLayout
				leftContent={<LoginBrandPanel />}
				rightContent={
					<LoginForm
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						businessName={businessName}
						onForgotPassword={() => setIsForgotPasswordOpen(true)}
					/>
				}
				leftBg="bg-slate-900"
				leftWidth="lg:w-[40%]"
			/>
			<ForgotPasswordModal
				isOpen={isForgotPasswordOpen}
				onClose={() => setIsForgotPasswordOpen(false)}
			/>
		</>
	);
};

export default Login;
