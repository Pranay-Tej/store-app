import { useCartContext } from '@/context/cart.context';
import { ActionIcon } from '@mantine/core';
import React from 'react';
import { Minus, Plus } from 'tabler-icons-react';

const ManageCartItem: React.FC<{ productId: string; quantity: number }> = ({
  productId,
  quantity
}) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } =
    useCartContext();
  return (
    <div className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-50">
      <ActionIcon
        size="lg"
        aria-label="decrease"
        onClick={() => {
          if (quantity > 1) {
            decreaseQuantity(productId, quantity);
          } else {
            removeFromCart(productId);
          }
        }}
      >
        <Minus strokeWidth={1.5} />
      </ActionIcon>
      <p className="text-lg font-semibold">{quantity}</p>
      <ActionIcon
        size="lg"
        aria-label="increase"
        onClick={() => {
          increaseQuantity(productId, quantity);
        }}
      >
        <Plus strokeWidth={1.5} />
      </ActionIcon>
    </div>
  );
};

export default ManageCartItem;
