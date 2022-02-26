import Product from '@/components/Product';
import { FAKE_STORE_API_BASE_URL } from '@/constants/app.constants';
import useAxiosGet from '@/hooks/useAxiosGet';
import { ProductModel } from '@/models/product.model';
import styles from '@/pages/Home.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const {
    fetchData: fetchAllProducts,
    isLoading,
    data,
    errorMessage
  } = useAxiosGet<ProductModel[]>();

  useEffect(() => {
    fetchAllProducts({
      url: `${FAKE_STORE_API_BASE_URL}/products`,
      isProtected: true
    });
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
      className={`${styles.productGrid} my-5 mx-auto max-w-5xl bg-white px-3 pt-8`}
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
