import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { bills, households, usersToHouseholds, usersToHouseholdsRelations } from '$lib/server/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const household = alias(households, 'household');

export const load = async ({ locals }) => {
  console.info('Something something');

  const session = await locals.getSession();

  if(!session || !session.user) {
    throw error(401, 'Not logged in');
  }

  const fullQuery = await db
    .select()
    .from(bills)
    .innerJoin(usersToHouseholds, eq(usersToHouseholds.userId, session.user.id))
    .innerJoin(household, and(eq(bills.householdId, household.id), eq(usersToHouseholds.householdId, household.id)));

  console.info('FULLQUERY', fullQuery);

  return {
    bills: fullQuery,
  };
}