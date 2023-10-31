import { db, schema } from '$lib/server/db';

export type Household = typeof schema.households.$inferSelect;
export type HouseholdInsertArgs = typeof schema.households.$inferInsert;

export async function addHousehold(household: HouseholdInsertArgs) {

  const [returnedHousehold] = await db.insert(schema.households).values(household);
  return returnedHousehold;
}

export async function updateHousehold(householdId: string, data: Partial<Omit<Household, 'id'>>) {
  return {};
}

export async function deleteHousehold(householdId: string) {
  const household = await db.query.households.findFirst({
    with: {
      users: true,
    },
    where: ({ id }, { eq }) => eq(id, householdId)
  });
  console.info(household);
  return household;
}