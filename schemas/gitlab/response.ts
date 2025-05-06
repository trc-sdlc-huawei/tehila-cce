import { z } from 'zod';
import { GitLabFileContentSchema } from './content.js';
import { GitLabRepositorySchema } from './repository.js';

export const GitLabCreateUpdateFileResponseSchema = z.object({
  file_path: z.string(),
  branch: z.string(),
  commit_id: z.string(),
  content: GitLabFileContentSchema.optional()
});

export const GitLabSearchResponseSchema = z.object({
  count: z.number(),
  items: z.array(GitLabRepositorySchema)
});

export type GitLabCreateUpdateFileResponse = z.infer<typeof GitLabCreateUpdateFileResponseSchema>;
export type GitLabSearchResponse = z.infer<typeof GitLabSearchResponseSchema>;
