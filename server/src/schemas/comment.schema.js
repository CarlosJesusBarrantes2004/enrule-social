import { z } from 'zod';

export const commentSchema = z.object({
  comment: z.string().min(1),
  from: z.string(),
});

export const replyCommentSchema = z.object({
  comment: z.string().min(1),
  from: z.string(),
  replyAt: z.string(),
});
