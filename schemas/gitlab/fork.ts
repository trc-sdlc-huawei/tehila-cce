import { z } from 'zod';
import { GitLabRepositorySchema } from './repository.js';

export const GitLabForkParentSchema = z.object({
  name: z.string(),
  path_with_namespace: z.string(),
  owner: z.object({
    username: z.string(),
    id: z.number(),
    avatar_url: z.string()
  }),
  web_url: z.string()
});

export const GitLabForkSchema = GitLabRepositorySchema.extend({
  forked_from_project: GitLabForkParentSchema
});

export type GitLabForkParent = z.infer<typeof GitLabForkParentSchema>;
export type GitLabFork = z.infer<typeof GitLabForkSchema>;
