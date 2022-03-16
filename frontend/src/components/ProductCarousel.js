import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { listHighRatedProducts } from '../actions/productActions';

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productHighRated = useSelector(state => state.productHighRated);
  const { loading, error, products } = productHighRated;

  useEffect(() => {
    dispatch(listHighRatedProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1 className='text-info'>Highly Rated Products</h1>
      <Carousel pause='hover' className='rounded bg-carousel-jugomar'>
        {products.map(product =>
          product.name === 'Sample name' ? (
            ''
          ) : (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption className='carousel-caption'>
                  <h2>
                    {product.name} - {product.subname}
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          )
        )}
      </Carousel>
    </>
  );
};

export default ProductCarousel;
