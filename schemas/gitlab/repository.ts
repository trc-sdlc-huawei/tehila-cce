import { z } from 'zod';

export const GitLabOwnerSchema = z.object({
  username: z.string(),
  id: z.number(),
  avatar_url: z.string(),
  web_url: z.string(),
  name: z.string(),
  state: z.string()
});

export const GitLabRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  path_with_namespace: z.string(),
  visibility: z.string(),
  owner: GitLabOwnerSchema.optional(),
  web_url: z.string(),
  description: z.string().nullable(),
  fork: z.boolean().optional(),
  ssh_url_to_repo: z.string(),
  http_url_to_repo: z.string(),
  created_at: z.string(),
  last_activity_at: z.string(),
  default_branch: z.string()
});


export type GitLabOwner = z.infer<typeof GitLabOwnerSchema>;
export type GitLabRepository = z.infer<typeof GitLabRepositorySchema>;
