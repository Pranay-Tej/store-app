import { CASHFREE_BASE_URL, CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET } from '$env/static/private';
import { OrderTable } from '$lib/schema/OrderTable.js';
import { db } from '$lib/server/db/client.js';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error } from '@sveltejs/kit';
import axios from 'axios';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const order_token = event.url.searchParams.get('order_token');
	const order_id = event.url.searchParams.get('order_id');
	if (!order_token || !order_id) {
		throw error(500, { message: 'Missing order token or order id' });
	}

	const [cashFreeOrder, err] = await resolvePromise(
		axios.get<{
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
		})
	);
	if (err || !cashFreeOrder?.data) {
		throw error(500, { message: 'Something went wrong' });
	}

	// console.log(cashFreeOrder.data);
	if (cashFreeOrder.data.order_token !== order_token) {
		throw error(500, { message: 'Invalid order token' });
	}

	if (cashFreeOrder.data.order_status !== 'PAID') {
		const [order, orderErr] = await resolvePromise(
			db.query.OrderTable.findFirst({
				where: (OrderTable, { eq }) => eq(OrderTable.id, order_id)
			})
		);
		if (orderErr || !order) {
			throw error(404, { message: 'Order not found' });
		}
		return { order };
	}
	const [orders, orderErr] = await resolvePromise(
		db
			.update(OrderTable)
			.set({
				status: 'paid'
			})
			.where(eq(OrderTable.id, order_id))
			.returning()
	);

	if (orderErr || !orders) {
		throw error(404, { message: 'Order not found' });
	}
	return {
		order: orders[0]
	};
};
