import { db } from '$lib/server/db/client.js';

export const load = async ({ locals, params}) => {
  console.info(params.id);
  const household = await db.query.households.findFirst({
    where: ({ id }, { eq }) => eq(id, params.id),
    with: {
      users: true,
    }
  });
  
  return {
    household,
  }
}