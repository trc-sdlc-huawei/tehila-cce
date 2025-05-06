import { z } from 'zod';

export const GitLabReferenceSchema = z.object({
  name: z.string(),
  commit: z.object({
    id: z.string(),
    web_url: z.string()
  })
});

export type GitLabReference = z.infer<typeof GitLabReferenceSchema>;
