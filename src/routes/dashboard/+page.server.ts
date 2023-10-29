import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { bills, households, payments, usersToHouseholds } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const household = alias(households, 'household');

export const load = async ({ locals }) => {

  const session = await locals.getSession();

  if(!session || !session.user) {
    throw error(401, 'Not logged in');
  }

  const today = new Date();

  const fullQuery = await db
    .select()
    .from(bills)
    .innerJoin(usersToHouseholds, eq(usersToHouseholds.userId, session.user.id))
    .innerJoin(household, and(eq(bills.householdId, household.id), eq(usersToHouseholds.householdId, household.id)))
    .leftJoin(payments, and(eq(payments.forMonth, today.getMonth() + 1 ), eq(payments.billId, bills.id)));

  const todaysDate = today.getDate();
  const groupings = fullQuery.reduce((all, cur) => {
    const diff = today.getDate() - cur.bills.dueDate;

    if(cur.payments !== null) {
      all.paid.push(cur);
      return all;
    }

    if(todaysDate > cur.bills.dueDate && cur.payments === null) {
      all.past.push(cur);
      return all;
    }

    if(diff > -5 && diff < 0) {
      all.upcoming.push(cur);
    }

    if(diff >= 5 && diff < 10) {
      all.comingSoon.push(cur);
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