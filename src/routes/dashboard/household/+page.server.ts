import { db } from '$lib/server/db';

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
  addHouseHold: async ({ locals, request }) => {
    console.info('saving', request, locals);
    return {
      success: true,
    }
  }
}