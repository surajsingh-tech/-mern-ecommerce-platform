import * as yup from "yup";

export const addressSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zipCode: yup
    .string()
    .matches(/^[0-9]{5,6}$/)
    .required(),
  country: yup.string().required(),
});