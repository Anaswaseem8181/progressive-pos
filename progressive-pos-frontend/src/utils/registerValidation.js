import * as yup from "yup";

export const registerValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    contactNumber: yup
        .string()
        .matches(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/, "Invalid Pakistani phone number")
        .required("Contact number is required"),
    businessName: yup.string().required("Business name is required"),
    businessCategory: yup.string().required("Select category"),
});