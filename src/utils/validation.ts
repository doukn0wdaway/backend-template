import { z } from 'zod';

export const validate = (schema: z.ZodTypeAny, data: unknown) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(err => ({
        ...(err.path.length > 0 ? { path: err.path.join('.') } : {}), // Include path only if it's not empty
        message: err.message,
        received: data, // Show the received value in the error response
      })),
    };
  }

  return { success: true, data: result.data };
};

export const stringWithPositiveIntSchema = z
  .string()
  .refine(val => Number.isInteger(Number(val)) && Number(val) > 0, {
    message: 'Value must be a positive integer',
  })
  .transform(val => Number(val));
