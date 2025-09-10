import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["post", "article", "ebook", "script"], {
    message: "Invalid project type"
  })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;