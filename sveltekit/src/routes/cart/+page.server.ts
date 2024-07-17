import {
	APP_BASE_URL,
	CASHFREE_BASE_URL,
	CASHFREE_CLIENT_ID,
	CASHFREE_CLIENT_SECRET
} from '$env/static/private';
import { OrderItemTable, type OrderItemInsert } from '$lib/schema/OrderItemTable.js';
import { OrderTable } from '$lib/schema/OrderTable.js';
import { db } from '$lib/server/db/client';
import { resolvePromise } from '$lib/utils/resolvePromise.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import axios from 'axios';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw new Error('Not logged in');
	}
	const [addresses, err] = await resolvePromise(
		db.query.AddressTable.findMany({
			where: (AddressTable, { eq }) => eq(AddressTable.userId, userId)
		})
	);
	if (err || !addresses) {
		error(404, {
			message: 'Addresses not found'
		});
	}
	return { addresses };
};

export const actions: Actions = {
	order: async (event) => {
		let paymentLink: string | null = null;
		try {
			const data = Object.fromEntries(await event.request.formData());
			const userId = event.locals.user?.id;
			if (!userId || !data.addressId) {
				throw new Error('Not logged in');
			}
			paymentLink = await db.transaction(async (tx) => {
				const address = await tx.query.AddressTable.findFirst({
					where: (AddressTable, { and, eq }) =>
						and(eq(AddressTable.id, data.addressId), eq(AddressTable.userId, userId))
				});
				if (!address) {
					throw new Error('Address not found');
				}
				const cartItems = await tx.query.CartItemTable.findMany({
					where: (CartItemTable, { eq }) => eq(CartItemTable.userId, userId),
					with: {
						product: true
					}
				});
				if (!cartItems) {
					throw new Error('Empty cart');
				}
				const amount = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
				const [newOrder] = await tx
					.insert(OrderTable)
					.values({
						userId,
						address: address.address,
						amount,
						name: address.name,
						status: 'payment_pending'
					})
					.returning();
				if (!newOrder) {
					throw new Error('Failed to create order');
				}

				const cashFreeOrder = await axios.post<{
					order_token: string;
					payment_link: string;
				}>(
					`${CASHFREE_BASE_URL}/orders`,
					{
						order_id: newOrder.id,
						order_amount: amount,
						order_currency: 'INR',
						customer_details: {
							customer_id: userId,
							customer_phone: '9816512345'
						},
						order_meta: {
							return_url: `${APP_BASE_URL}/payment?order_id={order_id}&order_token={order_token}`
						}
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'x-api-version': '2022-01-01',
							'x-client-id': CASHFREE_CLIENT_ID,
							'x-client-secret': CASHFREE_CLIENT_SECRET
						}
					}
				);
				// console.log(cashFreeOrder.data);

				if (!cashFreeOrder.data.order_token) {
					throw new Error('Failed to create order');
				}

				await tx
					.update(OrderTable)
					.set({
						orderToken: cashFreeOrder.data.order_token,
						paymentLink: cashFreeOrder.data.payment_link
					})
					.where(eq(OrderTable.id, newOrder.id));

				const orderItems: OrderItemInsert[] = cartItems.map((item) => {
					return {
						userId,
						orderId: newOrder.id,
						quantity: item.quantity,
						productId: item.productId
					};
				});

				await tx.insert(OrderItemTable).values(orderItems);

				return cashFreeOrder.data.payment_link;
			});

			if (!paymentLink) {
				throw new Error('Failed to create order');
			}
		} catch (error) {
			console.error(error);
		}
		if (paymentLink) {
			redirect(303, paymentLink);
		}
	}
};
