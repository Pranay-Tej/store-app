import styles from '@/components/Product.module.css';
import { ProductModel } from '@/models/product.model';
import { Tooltip } from '@mantine/core';
import React from 'react';

const Product: React.FC<ProductModel> = ({
  id,
  title,
  price,
  description,
  image
}) => {
  return (
    <div
      className={`${styles.product} grid min-h-full rounded-sm bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg`}
    >
      {/* <div
        className={`${styles.productImage}`}
        style={{ backgroundImage: `url(${image})` }}
      > */}
      <div className="overflow-hidden">
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="h-auto min-h-full object-cover object-center"
        />
      </div>
      <div className="grid gap-2 p-3">
        <Tooltip label={title} withArrow>
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
            {title}
          </p>
        </Tooltip>
        <p className="font-semibold text-gray-700">&#8377; {price}</p>
        <p className="mt-3 overflow-hidden overflow-ellipsis text-xs text-gray-800 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Product;
