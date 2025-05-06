import { z } from 'zod';

export const GitLabAuthorSchema = z.object({
  name: z.string(),
  email: z.string(),
  date: z.string()
});

export type GitLabAuthor = z.infer<typeof GitLabAuthorSchema>;
