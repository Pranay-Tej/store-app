export const API_ROUTES = {
    addToCart: '/api/add-to-cart',
    updateCartItem: (id: string) => `/api/update-cart-item/${id}`,
    deleteCartItem: (id: string) => `/api/delete-cart-item/${id}`
}