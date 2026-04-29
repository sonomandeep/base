import { z } from "zod";

export const imageListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().int().nonnegative(),
  tag: z.string(),
});

export const imageListSchema = z.array(imageListItemSchema);

export type ImageListItem = z.infer<typeof imageListItemSchema>;
