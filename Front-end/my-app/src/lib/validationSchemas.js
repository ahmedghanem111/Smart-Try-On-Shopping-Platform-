import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least 2 of: uppercase, lowercase, or number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})
