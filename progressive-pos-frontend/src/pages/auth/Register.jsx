import AuthSplitLayout from "../../components/common/AuthSplitLayout";
import RegisterBrandPanel from "../../components/auth/RegisterBrandPanel";
import RegisterForm from "../../components/auth/RegisterForm";
import { useRegister } from "../../hooks/useRegister";

const Register = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    showCancelModal,
    handleCancel,
    confirmCancel,
    closeCancelModal
  } = useRegister();

  return (
    <AuthSplitLayout
      leftContent={<RegisterBrandPanel />}
      rightContent={
        <RegisterForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isLoading={isLoading}
          showCancelModal={showCancelModal}
          handleCancel={handleCancel}
          confirmCancel={confirmCancel}
          closeCancelModal={closeCancelModal}
        />
      }
      leftBg="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700"
    />
  );
};

export default Register;
