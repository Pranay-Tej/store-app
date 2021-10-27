import Product from '@/components/Product';
import useAxios from '@/hooks/useAxios';
import { ProductModel } from '@/models/product.model';
import { useEffect } from 'react';
import styles from '@/pages/Home.module.css';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
  const {
    execute,
    isLoading,
    data,
    errorMessage
  }: {
    data: ProductModel[];
    execute: () => void;
    isLoading: boolean;
    errorMessage: string | null;
  } = useAxios(`https://fakestoreapi.com/products`);

  useEffect(() => {
    execute();
    return () => {};
  }, []);
  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );
  if (errorMessage) return <div>Error</div>;
  return (
    <div
      className={`${styles.productGrid} max-w-5xl px-3 mx-auto pt-8 bg-white`}
    >
      {data &&
        data.map(
          ({
            id,
            title,
            description,
            image,
            price,
            rating,
            category
          }: ProductModel) => (
            <Link to={`/product/${id}`} key={id}>
              <Product
                id={id}
                title={title}
                description={description}
                image={image}
                price={price}
                category={category}
                rating={rating}
              />
            </Link>
          )
        )}
    </div>
  );
};

export default Home;
