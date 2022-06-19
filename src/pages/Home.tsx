import Product from '@/components/Product';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useGraphqlClient } from '@/context/graphql-client.context';
import { GET_PRODUCTS } from '@/graphql/products';
import { ProductModel } from '@/models/product.model';
import styles from '@/pages/Home.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Home = () => {
  const { graphQlClient } = useGraphqlClient();
  const {
    data: productList,
    isLoading,
    error
  } = useQuery(REACT_QUERY_KEYS.GET_PRODUCTS, async () => {
    const res = await graphQlClient.request(GET_PRODUCTS);
    return res?.products;
  });

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <div
      className={`${styles.productGrid} my-5 mx-auto max-w-5xl bg-white px-3 pt-8`}
    >
      {productList &&
        productList.map(
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
