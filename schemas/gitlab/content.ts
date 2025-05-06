import { z } from 'zod';

export const GitLabFileContentSchema = z.object({
  file_name: z.string(),
  file_path: z.string(),
  size: z.number(),
  encoding: z.string(),
  content: z.string(),
  content_sha256: z.string(),
  ref: z.string(),
  blob_id: z.string(),
  last_commit_id: z.string()
});

export const GitLabDirectoryContentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  mode: z.string(),
  id: z.string(),
  web_url: z.string()
});

export const GitLabContentSchema = z.union([
  GitLabFileContentSchema,
  z.array(GitLabDirectoryContentSchema)
]);

export type GitLabFileContent = z.infer<typeof GitLabFileContentSchema>;
export type GitLabDirectoryContent = z.infer<typeof GitLabDirectoryContentSchema>;
export type GitLabContent = z.infer<typeof GitLabContentSchema>;
