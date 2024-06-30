import { COOKIE_TOKEN } from '$lib/constants/auth';
import { ROUTES } from '$lib/constants/routes';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (req) => {
	req.cookies.delete(COOKIE_TOKEN, {
		path: '/',
		httpOnly: true
	});
	redirect(303, ROUTES.login);
};
