import { z } from "zod";

import { bookingRequestSchema } from "./schema";

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>;
