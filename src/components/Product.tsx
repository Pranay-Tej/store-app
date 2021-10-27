import { ProductModel } from '@/models/product.model';
import React from 'react';
import styles from '@/components/Product.module.css';
import { Tooltip } from '@mui/material';

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
      className={`${styles.product} grid min-h-full transition-shadow duration-300 rounded-sm shadow-sm hover:shadow-lg bg-white`}
    >
      {/* <div
        className={`${styles.productImage}`}
        style={{ backgroundImage: `url(${image})` }}
      > */}
      <div className="flex justify-center">
        <img src={image} alt={title} className="object-contain h-full" />
      </div>
      <div className={`${styles.productInfo} p-3 grid gap-2`}>
        <Tooltip title={title}>
          <p className="overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
            {title}
          </p>
        </Tooltip>
        <p className="font-semibold text-gray-700">{price}</p>
      </div>
    </div>
  );
};

export default Product;
