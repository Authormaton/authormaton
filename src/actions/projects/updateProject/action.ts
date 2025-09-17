"use server";

import { authActionClient } from "@/lib/createSafeAction";
import { updateProject } from "./logic";
import { updateProjectSchema } from "./schema";

export const updateProjectAction = authActionClient
  .inputSchema(updateProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await updateProject(parsedInput, ctx.user.userId);
    } catch (error) {
      throw new Error("Something went wrong", { cause: error });
    }
  });
