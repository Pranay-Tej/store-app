import { db } from '$lib/server/db/client';

export const load = async ({ params }) => {
	try {
		const product = await db.query.ProductTable.findFirst({
			where: (ProductTable, { eq }) => eq(ProductTable.id, params.id)
		});
		return { product };
	} catch (error) {
		console.error(error);
	}
};
