import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { SHIRUDO_APP_ID, SHIRUDO_BASE_URL } from '$env/static/private';
import axios from 'axios';
import { ROUTES } from '$lib/constants/routes';
import { COOKIE_TOKEN } from '$lib/constants/auth';

export const actions: Actions = {
	login: async (event) => {
		let success: boolean = false;
		try {
			const data = Object.fromEntries(await event.request.formData());
			const res = await axios.post<{
				token: string;
			}>(`${SHIRUDO_BASE_URL}/users/login`, {
				identity: data.username,
				password: data.password,
				appId: SHIRUDO_APP_ID
			});

			if (res.data.token) {
				event.cookies.set(COOKIE_TOKEN, res.data.token, {
					path: '/',
					httpOnly: true,
					maxAge: 86400 // 24 * 60 * 60 (in seconds) 24 * 1h * 1m = 1 day
					// maxAge: 20 // 20 seconds, testing
				});

				success = true;
			}
		} catch (error) {
			console.error(JSON.stringify(error));
			return fail(500, { error: JSON.stringify(error) });
		}
		if (success) {
			redirect(303, ROUTES.home);
		}
	}
};
