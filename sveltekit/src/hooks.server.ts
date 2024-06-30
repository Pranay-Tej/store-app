import { SHIRUDO_JWT_SECRET } from '$env/static/private';
import { COOKIE_TOKEN } from '$lib/constants/auth';
import { ROUTES } from '$lib/constants/routes';
import type { DecodedToken } from '$lib/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';

const authenticate: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_TOKEN);

	if (!token && event.route.id?.includes('/api')) {
		throw redirect(301, ROUTES.login);
	}

	if (token) {
		try {
			const decodedToken = jwt.verify(token, SHIRUDO_JWT_SECRET) as DecodedToken;
			if (decodedToken) {
				const userDetails = {
					id: decodedToken.user_id,
					username: decodedToken.username,
					role: decodedToken.role
				};
				event.locals.user = userDetails;
			}
		} catch (error) {
			console.error(error);

			event.cookies.delete(COOKIE_TOKEN, {
				path: '/'
			});
		}
	}

	return resolve(event);
};

export const handle = sequence(authenticate);
