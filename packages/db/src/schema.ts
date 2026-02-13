import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const residents = pgTable("residents", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertResidentSchema = createInsertSchema(residents).pick({
    email: true,
}).extend({
    email: z.string().email("INVALID_ENDPOINT_FORMAT"),
});

export const selectResidentSchema = createSelectSchema(residents);
