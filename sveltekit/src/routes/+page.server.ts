import { db } from '$lib/server/db/client';

export const load = async () => {
	try {
		const products = await db.query.ProductTable.findMany();
		return { products };
	} catch (error) {
		console.error(error);
	}
};
