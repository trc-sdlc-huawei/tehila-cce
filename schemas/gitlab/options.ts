import { z } from 'zod';

// Input schemas for operations
export const CreateRepositoryOptionsSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    // enum in schema
    visibility: z.enum(['private', 'internal', 'public']).optional(), // Changed from private to match GitLab API
    initialize_with_readme: z.boolean().optional() // Changed from auto_init to match GitLab API
});

export const CreateIssueOptionsSchema = z.object({
    title: z.string(),
    description: z.string().optional(), // Changed from body to match GitLab API
    assignee_ids: z.array(z.number()).optional(), // Changed from assignees to match GitLab API
    milestone_id: z.number().optional(), // Changed from milestone to match GitLab API
    labels: z.array(z.string()).optional()
});

export const CreateMergeRequestOptionsSchema = z.object({ // Changed from CreatePullRequestOptionsSchema
    title: z.string(),
    description: z.string().optional(), // Changed from body to match GitLab API
    source_branch: z.string(), // Changed from head to match GitLab API
    target_branch: z.string(), // Changed from base to match GitLab API
    allow_collaboration: z.boolean().optional(), // Changed from maintainer_can_modify to match GitLab API
    draft: z.boolean().optional()
});

export const CreateBranchOptionsSchema = z.object({
    name: z.string(), // Changed from ref to match GitLab API
    ref: z.string() // The source branch/commit for the new branch
});


export type CreateRepositoryOptions = z.infer<typeof CreateRepositoryOptionsSchema>;
export type CreateIssueOptions = z.infer<typeof CreateIssueOptionsSchema>;
export type CreateMergeRequestOptions = z.infer<typeof CreateMergeRequestOptionsSchema>;
export type CreateBranchOptions = z.infer<typeof CreateBranchOptionsSchema>;



