import Product from '@/components/Product';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { GET_PRODUCTS } from '@/graphql/products';
import { ProductModel } from '@/models/product.model';
import styles from '@/pages/Home.module.css';
import { graphqlClient } from '@/utils/graphql-instance';
import { Card, Image, Loader } from '@mantine/core';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Home = () => {
  const {
    data: productList,
    isLoading,
    error
  } = useQuery(REACT_QUERY_KEYS.GET_PRODUCTS, async () => {
    const res = await graphqlClient.request(GET_PRODUCTS);
    return res?.products;
  });

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader variant="bars" />
      </div>
    );

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <div
      className={`${styles.productGrid} my-5 mx-auto max-w-7xl bg-white px-5 py-8`}
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
              {/* <Card shadow="sm" p="md" className="group group-hover:scale-110">
                <Card.Section>
                  <Image src={image} height={300} alt="Norway" />
                </Card.Section>
                <div className="mt-4">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-3 font-semibold text-gray-800">
                    &#8377; {price}
                  </p>
                  <p className="mt-3 overflow-hidden overflow-ellipsis text-xs text-gray-800 line-clamp-2">
                    {description}
                  </p>
                </div>
              </Card> */}
            </Link>
          )
        )}
    </div>
  );
};

export default Home;
