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

  const today = new Date();
  const todaysDate = today.getDate();
  const groupings = fullQuery.reduce((all, cur) => {
    const diff = today.getDate() - cur.bills.dueDate;
    if(diff > 0 && diff < 5) {
     all.upcoming.push(cur);
    }
    if(diff >= 5 && diff < 10) {
      all.comingSoon.push(cur);
    }
    if(todaysDate > cur.bills.dueDate) {
      all.past.push(cur);
    }
    return all;
  }, {
    upcoming: [],
    comingSoon: [],
    paid: [],
    past: [],
    rest: []
  } as Record<'upcoming' | 'comingSoon' | 'paid' | 'past' | 'rest', typeof fullQuery[0][]>);

  return {
    bills: fullQuery,
    groupings,
  };
}