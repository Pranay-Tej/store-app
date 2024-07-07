import { CASHFREE_BASE_URL, CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET } from '$env/static/private';
import { OrderTable } from '$lib/schema/OrderTable.js';
import { db } from '$lib/server/db/client.js';
import axios from 'axios';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	try {
		const order_token = event.url.searchParams.get('order_token');
		const order_id = event.url.searchParams.get('order_id');
		if (!order_token || !order_id) {
			throw new Error('Missing order token or order id');
		}

		const cashFreeOrder = await axios.get<{
			order_token: string;
			payment_link: string;
			order_status: 'ACTIVE' | 'PAID';
		}>(`${CASHFREE_BASE_URL}/orders/${order_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-api-version': '2022-01-01',
				'x-client-id': CASHFREE_CLIENT_ID,
				'x-client-secret': CASHFREE_CLIENT_SECRET
			}
		});
		console.log(cashFreeOrder.data);
		if (cashFreeOrder.data.order_token !== order_token) {
			throw new Error('Invalid order token');
		}
		if (cashFreeOrder.data.order_status !== 'PAID') {
			const order = await db.query.OrderTable.findFirst({
				where: (OrderTable, { eq }) => eq(OrderTable.id, order_id)
			});
			return { order };
		}
		const [order] = await db
			.update(OrderTable)
			.set({
				status: 'paid'
			})
			.where(eq(OrderTable.id, order_id))
			.returning();

		return {
			order
		};
	} catch (error) {
		console.error(error);
	}
};
