import type { User } from '$lib/types';
import { getContext, setContext } from 'svelte';

const USER_CTX = 'user';

class UserState {
	#user = $state<User | null>(null);

	constructor(user: User | null) {
		this.#user = user;
	}

	get user() {
		return this.#user;
	}

	set user(user: User | null) {
		this.#user = user;
	}
}

export const setUserContext = (user: User | null) => {
	const userState = new UserState(user);
	setContext(USER_CTX, userState);
	return userState;
};

export const getUserContext = () => {
	return getContext<ReturnType<typeof setUserContext>>(USER_CTX);
};
