import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Role must be either user or admin')
    .default('user'),
});

export const quizSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  is_public: yup
    .boolean()
    .default(false),
});

export const answerSchema = yup.object().shape({
  text: yup
    .string()
    .required('Answer text is required')
    .min(1, 'Answer text cannot be empty'),
  is_correct: yup
    .boolean()
    .default(false),
});

export const questionSchema = yup.object().shape({
  text: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === undefined) {
        return null;
      }
      return value;
    }),
  type: yup
    .string()
    .required('Question type is required')
    .oneOf(['multiple_choice', 'true_false', 'short_answer'], 'Invalid question type'),
  time_limit: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === undefined || isNaN(value)) {
        return null;
      }
      return value;
    })
    .nullable()
    .integer('Time limit must be an integer')
    .min(1, 'Time limit must be at least 1 second'),
  order_index: yup
    .number()
    .required('Order index is required')
    .integer('Order index must be an integer')
    .min(0, 'Order index must be non-negative'),
  media_id: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === undefined || isNaN(value)) {
        return null;
      }
      return value;
    })
    .nullable()
    .integer('Media ID must be an integer'),
});

export const sessionSchema = yup.object().shape({
  quiz_id: yup
    .number()
    .required('Quiz selection is required')
    .integer('Quiz ID must be an integer'),
  host_id: yup
    .number()
    .required('Host ID is required')
    .integer('Host ID must be an integer'),
  url: yup
    .string()
    .required('URL is required')
    .matches(
      /^(\/|https?:\/\/)/,
      'URL must be a valid URL or start with /'
    ),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['pending', 'active', 'completed', 'cancelled'], 'Invalid status'),
});
