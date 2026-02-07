import type { z } from "zod";

import { leadFormSchema } from "./schema";

export type LeadFormValues = z.infer<typeof leadFormSchema>;
