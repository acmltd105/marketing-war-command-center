import { z } from "zod";

export const partySchema = z.object({
  id: z.string(),
  type: z.enum(["person", "org"]),
  displayName: z.string().min(1),
  primaryEmail: z.union([z.string().email(), z.null()]).optional(),
  primaryPhone: z.string().nullable().optional(),
});

export type Party = z.infer<typeof partySchema>;
