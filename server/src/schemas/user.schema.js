import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const updateUserSchema = zfd.formData({
  firstName: zfd.text(z.string().min(1, { message: 'First name is required' })),
  lastName: zfd.text(z.string().min(1, { message: 'Last name is required' })),
  location: zfd.text(z.string().min(1, { message: 'Location is required' })),
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
  profession: zfd.text(
    z.string().min(1, { message: 'Profession is required' })
  ),
});
