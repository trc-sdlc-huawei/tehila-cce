import { z } from 'zod';

export const GitLabCommitSchema = z.object({
  id: z.string(),
  short_id: z.string(),
  title: z.string(),
  author_name: z.string(),
  author_email: z.string(),
  authored_date: z.string(),
  committer_name: z.string(),
  committer_email: z.string(),
  committed_date: z.string(),
  web_url: z.string(),
  parent_ids: z.array(z.string())
});

export type GitLabCommit = z.infer<typeof GitLabCommitSchema>;
