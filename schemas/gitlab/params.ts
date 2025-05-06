import { z } from 'zod';

export const ProjectParamsSchema = z.object({
  project_id: z.string().describe('Project ID or URL-encoded path')
});

// schemas with describe
export const CreateOrUpdateFileSchema = ProjectParamsSchema.extend({
  file_path: z.string().describe('Path where to create/update the file'),
  content: z.string().describe('Content of the file'),
  commit_message: z.string().describe('Commit message'),
  branch: z.string().describe('Branch to create/update the file in'),
  previous_path: z.string().optional().describe('Path of the file to move/rename')
});

export const SearchRepositoriesSchema = z.object({
  search: z.string().describe('Search query'),
  page: z.number().optional().describe('Page number for pagination (default: 1)'),
  per_page: z.number().optional().describe('Number of results per page (default: 20)')
});

export const CreateRepositorySchema = z.object({
  name: z.string().describe('Repository name'),
  description: z.string().optional().describe('Repository description'),
  visibility: z.enum(['private', 'internal', 'public']).optional().describe('Repository visibility level'),
  initialize_with_readme: z.boolean().optional().describe('Initialize with README.md')
});

export const GetFileContentsSchema = ProjectParamsSchema.extend({
  file_path: z.string().describe('Path to the file or directory'),
  ref: z.string().optional().describe('Branch/tag/commit to get contents from')
});

export const PushFilesSchema = ProjectParamsSchema.extend({
  branch: z.string().describe('Branch to push to'),
  files: z.array(z.object({
    file_path: z.string().describe('Path where to create the file'),
    content: z.string().describe('Content of the file')
  })).describe('Array of files to push'),
  commit_message: z.string().describe('Commit message')
});

export const CreateIssueSchema = ProjectParamsSchema.extend({
  title: z.string().describe('Issue title'),
  description: z.string().optional().describe('Issue description'),
  assignee_ids: z.array(z.number()).optional().describe('Array of user IDs to assign'),
  labels: z.array(z.string()).optional().describe('Array of label names'),
  milestone_id: z.number().optional().describe('Milestone ID to assign')
});

export const CreateMergeRequestSchema = ProjectParamsSchema.extend({
  title: z.string().describe('Merge request title'),
  description: z.string().optional().describe('Merge request description'),
  source_branch: z.string().describe('Branch containing changes'),
  target_branch: z.string().describe('Branch to merge into'),
  // an optional boolean field 
  draft: z.boolean().optional().describe('Create as draft merge request'),
  allow_collaboration: z.boolean().optional().describe('Allow commits from upstream members')
});

export const ForkRepositorySchema = ProjectParamsSchema.extend({
  namespace: z.string().optional().describe('Namespace to fork to (full path)')
});

export const CreateBranchSchema = ProjectParamsSchema.extend({
  branch: z.string().describe('Name for the new branch'),
  ref: z.string().optional().describe('Source branch/commit for new branch')
});

export type ProjectParams = z.infer<typeof ProjectParamsSchema>;
export type CreateOrUpdateFile = z.infer<typeof CreateOrUpdateFileSchema>;
export type SearchRepositories = z.infer<typeof SearchRepositoriesSchema>;
export type CreateRepository = z.infer<typeof CreateRepositorySchema>;
export type GetFileContents = z.infer<typeof GetFileContentsSchema>;
export type PushFiles = z.infer<typeof PushFilesSchema>;
export type CreateIssue = z.infer<typeof CreateIssueSchema>;
export type CreateMergeRequest = z.infer<typeof CreateMergeRequestSchema>;
export type ForkRepository = z.infer<typeof ForkRepositorySchema>;
export type CreateBranch = z.infer<typeof CreateBranchSchema>;
