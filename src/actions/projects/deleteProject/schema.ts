import { z } from "zod";

export const deleteProjectSchema = z.object({
  id: z.string(),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
