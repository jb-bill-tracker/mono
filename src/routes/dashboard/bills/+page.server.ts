import { db } from "$lib/server/db"
import { bills as billsTable, households, usersToHouseholds } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  const session = await locals.getSession();

  if(!session || !session?.user) {
    throw redirect(300, '/login');
  }

  const bills = await db
    .select({
      billId: billsTable.id,
      billName: billsTable.billName,
      householdId: billsTable.householdId,
      householdName: households.name
    })
    .from(billsTable)
    .innerJoin(
      households,
      eq(households.id, billsTable.householdId)
    )
    .innerJoin(
      usersToHouseholds,
      and(
        eq(usersToHouseholds.householdId, households.id),
        eq(usersToHouseholds.userId, session.user.id)
      )
    )
    .orderBy(households.name, billsTable.billName);
  
  return {
    bills: bills
  }
}