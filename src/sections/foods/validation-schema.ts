import * as yup from 'yup';

export const foodFormValidationSchema = yup.object({
  name: yup
    .string()
    .required('Food name is required')
    .min(2, 'Food name must be at least 2 characters')
    .max(100, 'Food name must not exceed 100 characters')
    .test('no-leading-whitespace', 'Name cannot start with whitespace', (value) => {
      if (!value) return true;
      return !/^\s/.test(value);
    })
    .test('no-special-chars-start', 'Name cannot start with special characters', (value) => {
      if (!value) return true;
      return !/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    })
    .test('alphanumeric-mix', 'Name must contain a mix of letters and numbers', (value) => {
      if (!value) return true;
      const hasLetters = /[a-zA-Z]/.test(value);
      const hasNumbers = /[0-9]/.test(value);
      return hasLetters && hasNumbers;
    })
    .trim(),

  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim(),

  price: yup
    .string()
    .required('Price is required')
    .test('numbers-only', 'Price must contain only numbers', (value) => {
      if (!value) return true;
      return /^\d+(\.\d+)?$/.test(value);
    })
    .test('no-whitespace', 'Price cannot contain whitespace', (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test('no-alphabets', 'Price cannot contain alphabets', (value) => {
      if (!value) return true;
      return !/[a-zA-Z]/.test(value);
    })
    .test('positive-number', 'Price must be a positive number', (value) => {
      if (!value) return true;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('max-price', 'Price cannot exceed $9999.99', (value) => {
      if (!value) return true;
      const num = parseFloat(value);
      return !isNaN(num) && num <= 9999.99;
    }),

  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      ['breakfast', 'lunch', 'dinner', 'snacks', 'desserts', 'beverages'],
      'Please select a valid category'
    ),

  preparationTime: yup
    .string()
    .test('positive-integer', 'Preparation time must be a positive integer', (value) => {
      if (!value) return true;
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0 && Number.isInteger(num);
    })
    .test('max-time', 'Preparation time cannot exceed 480 minutes (8 hours)', (value) => {
      if (!value) return true;
      const num = parseInt(value, 10);
      return !isNaN(num) && num <= 480;
    }),

  available: yup
    .boolean()
    .required('Availability status is required'),

  image: yup
    .string()
    .optional(),
});

export type FoodFormData = yup.InferType<typeof foodFormValidationSchema>;
