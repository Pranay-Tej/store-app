export const ROUTES = {
	home: '/',
	login: '/login',
	register: '/register',
	cart: '/cart',
	product: (id: string) => `/product/${id}`,
	addresses: '/addresses',
	orders: '/orders',
	order: (id: string) => `/orders/${id}`
};
