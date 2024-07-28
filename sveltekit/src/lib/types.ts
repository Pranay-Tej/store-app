export type DecodedToken = {
	username: string;
	user_id: string;
	role: string;
};

export type User = {
	id: string | null;
	username: string | null;
	role: string | null;
};
