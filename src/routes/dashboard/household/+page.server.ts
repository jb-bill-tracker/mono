import { db } from '$lib/server/db';
import { households } from '$lib/server/db/schema/households.table.js';
import { usersHouseholds, usersToHouseholds } from '$lib/server/db/schema/usersToHouseholds.table.js';
import { eq, sql } from 'drizzle-orm';
import { ulid } from 'ulid';

export const load = async ({ locals }) => {
  const { data: { user }, error } = await locals.supabase.auth.getUser();

  if(error || !user ) {
    return { households: []}
  }

  const tmpUser = await db.query.users.findFirst({
    with: {
      households: {
        with: {
          household: {
            with: {
              users: true 
            }
          },
        }
      },
    },
    where({ id }, { eq }) {
      return eq(id, user.id);
    }
  });

  return {
    households: tmpUser?.households.map(t => t.household)  || [],
  };
}

export const actions = {
  addHousehold: async ({ request, locals }) => {
    const session = await locals.getSession();
    const data = await request.formData();

    if(data.has('household-name') && session && session.user) {
      const [household] = await db.insert(households).values({
        id: ulid(),
        name: data.get('household-name') as string
      }).returning();

      await db.insert(usersToHouseholds).values({
        userId: session.user.id,
        householdId: household.id,
      });

      return {
        success: true,
        type: 'add-household',
        household,
      }
    }

    return {
      success: false,
    }
  },
  deleteHousehold: async ({ request, locals }) => {
    const session = await locals.getSession();
    const data = await request.formData();
    console.info(data.get('household-id'))

    if(!session) {
      return {
        success: false,
        type: 'delete-household',
        code: 401,
      }
    }

    const householdId = data.get('household-id');

    // Need this to run correctly.
    if(!householdId || typeof householdId !== 'string') {
      return {
        success: false,
        type: 'delete-household',
        code: 400,
      }
    }

    db.query.users.findFirst({
      with: {
        households: true
      }
    }).then(r => r.household);

    const household = await db.query.households.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, householdId)
      },
    });
    
    console.info(household);
    // Can only delete households with 1 member.

    // if(household && household.users.length === 1 && household.users.some(v => v.userId === session.user.id)) {
    //   console.info('we can delete');
    //   const somanyThings = await db.query.households.findFirst({
    //     where({id}, { eq}) {
    //       return eq(id, householdId);
    //     },
    //     with: {
    //       bills: true,
    //     }
    //   });
    //   console.info('somanythings', somanyThings);
    //   const resp = await db.delete(households).where(eq(households.id, householdId)).returning();
    //   console.info('DELETE RESPONSE', resp);
    // } else {
    //   console.info('no can delete');
    //   return {
    //     success: false,
    //     code: 400,
    //     type: 'delete-household'
    //   };
    // }

    return {
      success: true,
      type: 'delete-household',
      code: 200,
    };    
  }
}
