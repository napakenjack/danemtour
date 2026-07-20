import { z } from 'zod';

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Введите имя')
    .max(80, 'Слишком длинное имя'),
  phone: z
    .string()
    .trim()
    .min(10, 'Введите номер телефона')
    .regex(/^[\d+()\s-]+$/, 'Только цифры и знаки + ( ) -'),
  message: z.string().trim().max(500, 'Слишком длинное сообщение').optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
