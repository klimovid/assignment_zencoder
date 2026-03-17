import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Team = z.infer<typeof TeamSchema>;
