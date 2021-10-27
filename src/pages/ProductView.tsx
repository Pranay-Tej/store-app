import useAxios from '@/hooks/useAxios';
import { ProductModel } from '@/models/product.model';
import React, { useEffect } from 'react';
import styles from '@/pages/ProductView.module.css';
import { useParams } from 'react-router';

const ProductView = () => {
  const { id } = useParams<{ id: string }>();

  const {
    execute,
    isLoading,
    data,
    errorMessage
  }: {
    data: ProductModel;
    execute: () => void;
    isLoading: boolean;
    errorMessage: string | null;
  } = useAxios(`https://fakestoreapi.com/products/${id}`);

  useEffect(() => {
    execute();
    return () => {};
  }, []);

  if (isLoading) return <div>Loading</div>;
  if (errorMessage) return <div>Error</div>;
  // const { image, title, price } = data;
  return (
    <div className={styles.productGrid}>
      {data && (
        <div className={styles.product}>
          <div
            className={styles.productImage}
            style={{ backgroundImage: `url(${data.image})` }}
          >
            {/* <img src={image} alt={title} /> */}
          </div>
          <p>{data.title}</p>
          <p>{data.price}</p>
        </div>
      )}
    </div>
  );
};

export default ProductView;
