import { z } from 'zod';
import { GitLabUserSchema } from './issue.js';

export const GitLabMergeRequestDiffRefSchema = z.object({
  base_sha: z.string(),
  head_sha: z.string(),
  start_sha: z.string()
});

export const GitLabMergeRequestSchema = z.object({
  id: z.number(),
  iid: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  state: z.string(),
  merged: z.boolean().optional(),
  author: GitLabUserSchema,
  assignees: z.array(GitLabUserSchema),
  source_branch: z.string(),
  target_branch: z.string(),
  diff_refs: GitLabMergeRequestDiffRefSchema.nullable(),
  web_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  merged_at: z.string().nullable(),
  closed_at: z.string().nullable(),
  merge_commit_sha: z.string().nullable()
});

export type GitLabMergeRequestDiffRef = z.infer<typeof GitLabMergeRequestDiffRefSchema>;
export type GitLabMergeRequest = z.infer<typeof GitLabMergeRequestSchema>;
