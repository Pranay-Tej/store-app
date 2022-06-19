import styles from '@/components/Product.module.css';
import { ProductModel } from '@/models/product.model';
import { Tooltip } from '@mantine/core';
import React from 'react';

const Product: React.FC<ProductModel> = ({
  id,
  title,
  price,
  description,
  category,
  image,
  rating
}) => {
  return (
    <div
      className={`${styles.product} grid min-h-full rounded-sm bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg`}
    >
      {/* <div
        className={`${styles.productImage}`}
        style={{ backgroundImage: `url(${image})` }}
      > */}
      <div className="flex justify-center">
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="h-full object-contain"
        />
      </div>
      <div className="grid gap-2 p-3">
        <Tooltip label={title} withArrow>
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
            {title}
          </p>
        </Tooltip>
        <p className="font-semibold text-gray-700">{price}</p>
      </div>
    </div>
  );
};

export default Product;
