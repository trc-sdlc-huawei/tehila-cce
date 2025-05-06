import { z } from 'zod';

export const GitLabTreeEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['blob', 'tree']),
  path: z.string(),
  mode: z.string()
});

export const GitLabTreeSchema = z.object({
  id: z.string(),
  tree: z.array(GitLabTreeEntrySchema)
});

export type GitLabTreeEntry = z.infer<typeof GitLabTreeEntrySchema>;
export type GitLabTree = z.infer<typeof GitLabTreeSchema>;
