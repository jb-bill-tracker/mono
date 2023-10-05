import { relations } from "drizzle-orm";
import { pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { bills } from "./bills.table";

export const payments = pgTable(
  'payments',
  {
    id: text('id').primaryKey(),
    billId: text('bill_id').notNull().references(() => bills.id),
    proof: text('proof'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    updatedBy: text('updated_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    forMonth: smallint('for_month').notNull().default(1),
  }
);

export const paymentToBill = relations(payments, ({ one }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id]
  })
}));

export const billsToPayments = relations(bills, ({ many }) => ({
  payments: many(payments)
}));

// 01HBYR3XKPT9RK9AFCNFPH2Q5P 01ae907d-c0cf-4edd-a941-cc17910f60b6