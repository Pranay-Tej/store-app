import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { SHIRUDO_APP_ID, SHIRUDO_BASE_URL, SHIRUDO_JWT_SECRET } from '$env/static/private';
import axios from 'axios';
import { ROUTES } from '$lib/constants/routes';
import { COOKIE_TOKEN } from '$lib/constants/auth';
import { db } from '$lib/server/db/client';
import { UserTable } from '$lib/schema/UserTable';
import jwt from 'jsonwebtoken';
import type { DecodedToken } from '$lib/types';

export const actions: Actions = {
	register: async (event) => {
		let success: boolean = false;
		try {
			const data = Object.fromEntries(await event.request.formData());
			const createUserRes = await axios.post<{
				token: string;
			}>(`${SHIRUDO_BASE_URL}/users/register`, {
				username: data.username,
				password: data.password,
				appId: SHIRUDO_APP_ID
			});
			if (!createUserRes.data.token) {
				return fail(500, { error: 'Something went wrong' });
			}

			const decodedToken = jwt.verify(createUserRes.data.token, SHIRUDO_JWT_SECRET) as DecodedToken;

			if (!decodedToken) {
				return fail(500, { error: 'Something went wrong' });
			}

			const user = await db.insert(UserTable).values({
				id: decodedToken.user_id,
				name: decodedToken.username
			});
			if (!user) {
				return fail(500, { error: 'Something went wrong' });
			}

			event.cookies.set(COOKIE_TOKEN, createUserRes.data.token, {
				path: '/',
				httpOnly: true,
				maxAge: 86400 // 24 * 60 * 60 (in seconds) 24 * 1h * 1m = 1 day
				// maxAge: 20 // 20 seconds, testing
			});
			success = true;
		} catch (error) {
			console.error(error);
			return fail(500, { error });
		}

		if (success) {
			redirect(303, ROUTES.home);
		}
	}
};
