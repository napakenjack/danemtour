import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Введите имя').max(80, 'Слишком длинное имя'),
    email: z.string().trim().email('Введите корректный email'),
    phone: z
      .string()
      .trim()
      .regex(/^[\d+()\s-]*$/, 'Только цифры и знаки + ( ) -')
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Минимум 6 символов'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
