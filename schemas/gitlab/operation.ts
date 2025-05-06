import { z } from 'zod';

export const FileOperationSchema = z.object({
  path: z.string(),
  content: z.string()
});

export type FileOperation = z.infer<typeof FileOperationSchema>;
