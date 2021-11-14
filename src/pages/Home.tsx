import Product from '@/components/Product';
import useAxios from '@/hooks/useAxios';
import { ProductModel } from '@/models/product.model';
import styles from '@/pages/Home.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const {
    execute: fetchAllProducts,
    isLoading,
    data,
    errorMessage
  } = useAxios<ProductModel[]>();

  useEffect(() => {
    fetchAllProducts({ url: `https://fakestoreapi.com/products` });
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
      className={`${styles.productGrid} max-w-5xl px-3 my-5 mx-auto pt-8 bg-white`}
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
