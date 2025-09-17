"use server";

import { authActionClient } from "@/lib/action";
import { deleteProject } from "./logic";
import { deleteProjectSchema } from "./schema";

export const deleteProjectAction = authActionClient
  .inputSchema(deleteProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await deleteProject(parsedInput, ctx.user.userId);
    } catch (error) {
      throw new Error("Something went wrong", { cause: error });
    }
  });
