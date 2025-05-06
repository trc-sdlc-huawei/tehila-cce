import { z } from 'zod';

export const GitLabLabelSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  description: z.string().optional()
});

export const GitLabUserSchema = z.object({
  username: z.string(),
  id: z.number(),
  name: z.string(),
  avatar_url: z.string(),
  web_url: z.string()
});

export const GitLabMilestoneSchema = z.object({
  id: z.number(),
  iid: z.number(),
  title: z.string(),
  description: z.string(),
  state: z.string(),
  web_url: z.string()
});

export const GitLabIssueSchema = z.object({
  id: z.number(),
  iid: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  state: z.string(),
  author: GitLabUserSchema,
  assignees: z.array(GitLabUserSchema),
  labels: z.array(GitLabLabelSchema),
  milestone: GitLabMilestoneSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  web_url: z.string()
});

export type GitLabLabel = z.infer<typeof GitLabLabelSchema>;
export type GitLabUser = z.infer<typeof GitLabUserSchema>;
export type GitLabMilestone = z.infer<typeof GitLabMilestoneSchema>;
export type GitLabIssue = z.infer<typeof GitLabIssueSchema>;
