import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const postSchema = zfd.formData({
  description: zfd.text(
    z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Content must be less than 1000 characters')
  ),
  file: zfd.file(
    z
      .object({
        name: z.string(),
        size: z.number(),
        mimetype: z.string(),
        tempFilePath: z.string(),
      })
      .optional()
  ),
});
